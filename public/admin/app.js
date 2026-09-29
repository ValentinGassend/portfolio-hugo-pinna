import {COLLECTIONS} from "./schema.js";

const API = "api.php";
// 4 Mo : reste sous les limites PHP les plus basses (post_max_size = 8M par défaut)
const CHUNK_SIZE = 4 * 1024 * 1024;
const VIDEO_EXT = ["mp4", "mov", "webm", "avi", "wmv"];
const IMAGE_EXT = ["png", "jpg", "jpeg", "webp", "gif", "svg", "avif"];

const state = {
    user: null,
    csrf: null,
    content: null,
    collectionId: COLLECTIONS[0].id,
    search: "",
    editor: null, // {collection, draft, original, isNew}
};

const app = document.getElementById("app");

// ── Utilitaires DOM ──────────────────────────────────────────────────────────
function h(tag, attrs = {}, ...children) {
    const el = document.createElement(tag);
    for (const [key, value] of Object.entries(attrs || {})) {
        if (value === null || value === undefined || value === false) continue;
        if (key === "class") el.className = value;
        else if (key.startsWith("on")) el.addEventListener(key.slice(2).toLowerCase(), value);
        else if (key === "value") el.value = value;
        else if (key === "checked") el.checked = value;
        else el.setAttribute(key, value === true ? "" : value);
    }
    for (const child of children.flat(Infinity)) {
        if (child === null || child === undefined || child === false) continue;
        el.append(child instanceof Node ? child : document.createTextNode(String(child)));
    }
    return el;
}

const icon = (name) => h("span", {class: "material-symbols-outlined", "aria-hidden": "true"}, name);

function toast(message, kind = "info") {
    const el = h("div", {class: `toast ${kind}`, role: "status"}, message);
    document.body.append(el);
    setTimeout(() => el.classList.add("hide"), 3200);
    setTimeout(() => el.remove(), 3600);
}

function confirmDialog(message, confirmLabel = "Confirmer", danger = false) {
    return new Promise((resolve) => {
        const close = (value) => {
            overlay.remove();
            resolve(value);
        };
        const overlay = h("div", {class: "dialog-overlay", onclick: (e) => e.target === overlay && close(false)},
            h("div", {class: "dialog", role: "dialog", "aria-modal": "true"},
                h("p", {}, message),
                h("div", {class: "dialog-actions"},
                    h("button", {class: "btn text", onclick: () => close(false)}, "Annuler"),
                    h("button", {class: `btn ${danger ? "danger" : "primary"}`, onclick: () => close(true)}, confirmLabel),
                ),
            ),
        );
        document.body.append(overlay);
        overlay.querySelector(".btn:last-child").focus();
    });
}

const clone = (value) => (value === undefined ? undefined : structuredClone(value));
const getPath = (obj, path) => path.split(".").reduce((o, k) => (o == null ? undefined : o[k]), obj);
const extensionOf = (path) => (String(path).match(/\.([^.?#/]+)$/)?.[1] || "").toLowerCase();
const isVideo = (path) => VIDEO_EXT.includes(extensionOf(path));
const isImage = (path) => IMAGE_EXT.includes(extensionOf(path));
const mediaUrl = (path) => "/media/" + String(path).split("/").map(encodeURIComponent).join("/");
// Vignette légère : plus petite variante WebP générée par l'optimiseur (sinon l'original)
const thumbUrl = (path, minWidth = 320) => {
    const entry = state.manifest?.images?.[path];
    const width = entry?.widths?.find((w) => w >= minWidth) ?? entry?.widths?.at(-1);
    return width ? mediaUrl(`_optimized/${String(path).replace(/\.[^./]+$/, "")}-${width}.webp`) : mediaUrl(path);
};
const posterUrl = (path) => {
    const poster = state.manifest?.videos?.[path]?.poster;
    return poster ? mediaUrl(poster) : null;
};
const displayName = (path) => String(path).split("/").pop().replace(/^[a-z0-9]{5}_/i, "");
const collectionById = (id) => COLLECTIONS.find((c) => c.id === id);

// ── API ──────────────────────────────────────────────────────────────────────
async function api(action, {body, form, method} = {}) {
    const options = {method: method || (body || form ? "POST" : "GET"), headers: {}, credentials: "same-origin"};
    if (state.csrf) options.headers["X-CSRF-Token"] = state.csrf;
    if (form) options.body = form;
    else if (body) {
        options.headers["Content-Type"] = "application/json";
        options.body = JSON.stringify(body);
    }
    const res = await fetch(`${API}?action=${action}`, options);
    let data;
    try {
        data = await res.json();
    } catch {
        throw new Error(`Réponse invalide du serveur (HTTP ${res.status})`);
    }
    if (res.status === 401 && action !== "login") {
        state.user = null;
        render();
    }
    if (!res.ok) throw new Error(data.error || `Erreur HTTP ${res.status}`);
    return data;
}

async function uploadFile(file, dir, onProgress) {
    const total = Math.max(1, Math.ceil(file.size / CHUNK_SIZE));
    const uploadId = [...crypto.getRandomValues(new Uint8Array(16))].map((b) => b.toString(16).padStart(2, "0")).join("");
    let result;
    for (let index = 0; index < total; index++) {
        const form = new FormData();
        form.append("dir", dir);
        form.append("uploadId", uploadId);
        form.append("index", String(index));
        form.append("total", String(total));
        form.append("filename", file.name);
        form.append("chunk", file.slice(index * CHUNK_SIZE, (index + 1) * CHUNK_SIZE), "chunk");
        result = await api("upload", {form});
        onProgress?.((index + 1) / total);
    }
    return result.path;
}

// ── Rendu général ────────────────────────────────────────────────────────────
function render() {
    app.replaceChildren();
    if (!state.user) {
        app.append(renderAuth());
        return;
    }
    app.append(renderShell());
}

function renderAuth() {
    const setupToken = new URLSearchParams(location.search).get("setup");
    const isSetup = state.needsSetup && setupToken;
    const error = h("p", {class: "form-error", role: "alert"});
    const username = h("input", {type: "text", name: "username", autocomplete: "username", required: true, minlength: 2});
    const password = h("input", {
        type: "password", name: "password", required: true,
        autocomplete: isSetup ? "new-password" : "current-password", minlength: isSetup ? 12 : null,
    });
    const submit = h("button", {class: "btn primary block", type: "submit"}, isSetup ? "Créer le compte" : "Se connecter");

    const form = h("form", {
        class: "auth-card", onsubmit: async (e) => {
            e.preventDefault();
            error.textContent = "";
            submit.disabled = true;
            try {
                const data = await api(isSetup ? "setup" : "login", {
                    body: {username: username.value.trim(), password: password.value, token: setupToken},
                });
                if (isSetup) history.replaceState(null, "", location.pathname);
                state.user = data.user;
                state.csrf = data.csrf;
                await loadContent();
                render();
            } catch (err) {
                error.textContent = err.message;
                submit.disabled = false;
            }
        },
    },
        h("div", {class: "auth-logo"}, "Hugo Pinna", h("em", {}, "CMS")),
        h("h1", {}, isSetup ? "Créer le compte administrateur" : "Connexion"),
        state.needsSetup && !isSetup
            ? h("p", {class: "muted"}, "Le CMS n'est pas encore configuré. Ouvre le lien d'installation affiché lors du déploiement.")
            : null,
        h("label", {}, "Identifiant", username),
        h("label", {}, "Mot de passe", password),
        isSetup ? h("p", {class: "muted small"}, "12 caractères minimum.") : null,
        error,
        submit,
    );
    return h("div", {class: "auth"}, form);
}

function renderShell() {
    const collection = collectionById(state.collectionId);
    const nav = h("nav", {class: "drawer", "aria-label": "Collections"},
        h("div", {class: "drawer-title"}, "Hugo Pinna", h("em", {}, "CMS")),
        COLLECTIONS.map((c) => h("button", {
            class: `drawer-item ${c.id === state.collectionId ? "active" : ""}`,
            onclick: () => {
                state.collectionId = c.id;
                state.search = "";
                render();
            },
        }, h("span", {class: "label"}, c.name), h("span", {class: "count"}, state.content?.[c.id]?.length ?? 0))),
        h("div", {class: "drawer-spacer"}),
        h("a", {class: "drawer-item", href: "/", target: "_blank", rel: "noopener"}, icon("open_in_new"), "Voir le site"),
        h("button", {class: "drawer-item", onclick: openSettings}, icon("settings"), "Réglages"),
        h("button", {
            class: "drawer-item", onclick: async () => {
                await api("logout", {body: {}}).catch(() => null);
                state.user = null;
                state.csrf = null;
                render();
            },
        }, icon("logout"), `Déconnexion (${state.user})`),
    );

    return h("div", {class: "shell"}, nav, h("main", {class: "main"}, renderCollection(collection)), state.editor ? renderEditor() : null);
}

// ── Liste d'une collection ───────────────────────────────────────────────────
function renderCollection(collection) {
    let docs = [...(state.content[collection.id] || [])];
    if (collection.sortBy) {
        docs.sort((a, b) => (a[collection.sortBy] ?? Infinity) - (b[collection.sortBy] ?? Infinity));
    }
    const query = state.search.trim().toLowerCase();
    if (query) docs = docs.filter((d) => JSON.stringify(d).toLowerCase().includes(query));

    const canAdd = !collection.singleton || (state.content[collection.id] || []).length === 0;
    const search = h("input", {
        type: "search", class: "search", placeholder: "Rechercher…", value: state.search,
        oninput: (e) => {
            state.search = e.target.value;
            const main = document.querySelector(".main");
            main.replaceChildren(renderCollection(collection));
            const input = main.querySelector(".search");
            input.focus();
            input.setSelectionRange(input.value.length, input.value.length);
        },
    });

    const columnField = (path) => {
        const [first, second] = path.split(".");
        const field = collection.fields[first];
        return second ? field?.fields?.[second] : field;
    };

    const table = h("table", {class: "table"},
        h("thead", {}, h("tr", {}, h("th", {class: "id-col"}, "ID"), collection.columns.map((path) => h("th", {}, columnField(path)?.label || path)))),
        h("tbody", {}, docs.length === 0
            ? h("tr", {}, h("td", {class: "empty", colspan: collection.columns.length + 1}, query ? "Aucun résultat" : "Aucun document"))
            : docs.map((doc) => h("tr", {
                tabindex: "0",
                onclick: () => openEditor(collection, doc),
                onkeydown: (e) => e.key === "Enter" && openEditor(collection, doc),
            },
            h("td", {class: "id-col mono"}, doc.id),
            collection.columns.map((path) => h("td", {}, renderCell(columnField(path), getPath(doc, path)))),
            ))),
    );

    return h("section", {class: "collection"},
        h("header", {class: "collection-header"},
            h("div", {},
                h("h1", {}, collection.name),
                h("p", {class: "muted small"}, `${(state.content[collection.id] || []).length} document(s) · /${collection.id}`),
            ),
            h("div", {class: "collection-actions"},
                search,
                canAdd ? h("button", {class: "btn primary", onclick: () => openEditor(collection, null)}, icon("add"), `Ajouter`) : null,
            ),
        ),
        h("div", {class: "table-wrap"}, table),
    );
}

function renderCell(field, value) {
    if (!field) return value == null ? "" : String(value);
    switch (field.type) {
        case "file":
            return value ? renderThumb(value, "thumb") : h("span", {class: "muted"}, "—");
        case "files":
            return h("div", {class: "thumbs"}, (value || []).slice(0, 4).map((p) => renderThumb(p, "thumb small")), (value || []).length > 4 ? `+${value.length - 4}` : null);
        case "boolean":
            return value ? h("span", {class: "chip yes"}, "Oui") : h("span", {class: "chip no"}, "Non");
        case "tags":
            return (value || []).join(", ");
        default:
            return value == null || value === "" ? h("span", {class: "muted"}, "—") : h("span", {class: "clamp"}, String(value));
    }
}

function renderThumb(path, className) {
    if (isVideo(path) && posterUrl(path)) {
        return h("img", {class: className, src: posterUrl(path), loading: "lazy", decoding: "async", alt: displayName(path)});
    }
    if (isVideo(path)) {
        return h("video", {class: className, src: mediaUrl(path) + "#t=0.1", muted: true, preload: "metadata", playsinline: true});
    }
    if (isImage(path)) {
        return h("img", {class: className, src: thumbUrl(path, className.includes("preview") ? 640 : 320), loading: "lazy", decoding: "async", alt: displayName(path)});
    }
    return h("span", {class: `${className} file-icon`, title: displayName(path)}, icon("draft"), extensionOf(path));
}

// ── Éditeur ──────────────────────────────────────────────────────────────────
function defaultsFor(fields) {
    const doc = {};
    for (const [key, field] of Object.entries(fields)) {
        if (field.type === "map") doc[key] = defaultsFor(field.fields);
        else if (field.type === "files" || field.type === "tags" || field.type === "blocks") doc[key] = [];
        else if (field.type === "boolean") doc[key] = field.default ?? false;
        else if (field.type === "file" || field.type === "number") doc[key] = null;
        else doc[key] = "";
    }
    return doc;
}

function openEditor(collection, doc) {
    const draft = doc ? clone(doc) : defaultsFor(collection.fields);
    state.editor = {collectionId: collection.id, draft, original: JSON.stringify(draft), isNew: !doc, uploading: 0};
    render();
}

async function closeEditor() {
    const editor = state.editor;
    if (editor && JSON.stringify(editor.draft) !== editor.original) {
        if (!(await confirmDialog("Les modifications non enregistrées seront perdues.", "Fermer sans enregistrer", true))) return;
    }
    state.editor = null;
    render();
}

function renderEditor() {
    const editor = state.editor;
    const collection = collectionById(editor.collectionId);
    const errors = h("p", {class: "form-error", role: "alert"});

    const save = async (closeAfter) => {
        errors.textContent = "";
        if (editor.uploading > 0) {
            errors.textContent = "Attends la fin des envois de fichiers.";
            return;
        }
        const missing = Object.entries(collection.fields).filter(([key, f]) => f.required && (editor.draft[key] == null || editor.draft[key] === "")).map(([, f]) => f.label);
        if (missing.length) {
            errors.textContent = `Champ(s) obligatoire(s) : ${missing.join(", ")}`;
            return;
        }
        try {
            const {doc} = await api("save_doc", {body: {collection: collection.id, doc: editor.draft}});
            const list = state.content[collection.id];
            const index = list.findIndex((d) => d.id === doc.id);
            if (index === -1) list.push(doc);
            else list[index] = doc;
            toast(`${collection.singular} enregistré`, "success");
            if (closeAfter) state.editor = null;
            else state.editor = {...editor, draft: clone(doc), original: JSON.stringify(doc), isNew: false};
            render();
        } catch (err) {
            errors.textContent = err.message;
        }
    };

    const remove = async () => {
        if (!(await confirmDialog(`Supprimer définitivement ce document ? (une sauvegarde est conservée)`, "Supprimer", true))) return;
        try {
            await api("delete_doc", {body: {collection: collection.id, id: editor.draft.id}});
            state.content[collection.id] = state.content[collection.id].filter((d) => d.id !== editor.draft.id);
            state.editor = null;
            toast("Document supprimé", "success");
            render();
        } catch (err) {
            toast(err.message, "error");
        }
    };

    const panel = h("aside", {class: "editor", role: "dialog", "aria-label": `Édition ${collection.singular}`},
        h("header", {class: "editor-header"},
            h("button", {class: "icon-btn", title: "Fermer", onclick: closeEditor}, icon("close")),
            h("div", {},
                h("h2", {}, editor.isNew ? `Nouveau : ${collection.singular}` : collection.singular),
                editor.isNew ? null : h("p", {class: "muted small mono"}, `${collection.id}/${editor.draft.id}`),
            ),
        ),
        h("form", {class: "editor-body", onsubmit: (e) => { e.preventDefault(); save(true); }},
            renderFields(collection.fields, editor.draft),
        ),
        h("footer", {class: "editor-footer"},
            errors,
            h("div", {class: "editor-actions"},
                !editor.isNew && !collection.singleton ? h("button", {class: "btn danger text", onclick: remove}, icon("delete"), "Supprimer") : null,
                h("span", {class: "grow"}),
                h("button", {class: "btn text", onclick: () => save(false)}, "Enregistrer"),
                h("button", {class: "btn primary", onclick: () => save(true)}, "Enregistrer et fermer"),
            ),
        ),
    );
    return h("div", {class: "editor-overlay", onmousedown: (e) => e.target.classList.contains("editor-overlay") && closeEditor()}, panel);
}

function renderFields(fields, target) {
    return Object.entries(fields).map(([key, field]) => renderField(field, target, key));
}

function fieldWrap(field, control, extraClass = "") {
    return h("div", {class: `field ${extraClass}`},
        h("div", {class: "field-label"}, field.label, field.required ? h("span", {class: "required"}, " *") : null),
        control,
        field.description ? h("p", {class: "field-help"}, field.description) : null,
    );
}

function renderField(field, target, key) {
    const value = target[key];
    switch (field.type) {
        case "string":
            return fieldWrap(field, h("input", {
                type: "text", value: value ?? "", placeholder: field.placeholder,
                oninput: (e) => (target[key] = e.target.value),
            }));
        case "text": {
            const area = h("textarea", {rows: 8, oninput: (e) => { target[key] = e.target.value; autoGrow(e.target); }}, value ?? "");
            requestAnimationFrame(() => autoGrow(area));
            return fieldWrap(field, area);
        }
        case "number":
            return fieldWrap(field, h("input", {
                type: "number", value: value ?? "", step: "any",
                oninput: (e) => (target[key] = e.target.value === "" ? null : Number(e.target.value)),
            }));
        case "boolean":
            return h("label", {class: "field switch-field"},
                h("input", {type: "checkbox", role: "switch", checked: !!value, onchange: (e) => (target[key] = e.target.checked)}),
                h("span", {class: "switch"}),
                h("span", {}, field.label),
            );
        case "select":
            return fieldWrap(field, h("select", {onchange: (e) => (target[key] = e.target.value)},
                h("option", {value: ""}, "—"),
                Object.entries(field.options).map(([v, label]) => h("option", {value: v, selected: v === value}, label)),
            ));
        case "file":
            return fieldWrap(field, renderFileInput(field, target, key));
        case "files":
            return fieldWrap(field, renderFilesInput(field, target, key));
        case "tags":
            return fieldWrap(field, renderTagsInput(target, key));
        case "blocks":
            return fieldWrap(field, renderBlocksInput(field, target, key));
        case "map":
            if (!target[key] || typeof target[key] !== "object") target[key] = defaultsFor(field.fields);
            return h("fieldset", {class: "field map"}, h("legend", {}, field.label), renderFields(field.fields, target[key]));
        default:
            return null;
    }
}

function autoGrow(el) {
    el.style.height = "auto";
    el.style.height = Math.min(el.scrollHeight + 2, 640) + "px";
}

function withUpload(file, dir, progressEl) {
    state.editor.uploading++;
    progressEl.hidden = false;
    progressEl.value = 0;
    return uploadFile(file, dir, (p) => (progressEl.value = p))
        .then(async (path) => {
            await loadManifest();
            return path;
        })
        .finally(() => {
            state.editor && state.editor.uploading--;
            progressEl.hidden = true;
        });
}

function renderFileInput(field, target, key) {
    const container = h("div", {class: "file-input"});
    const draw = () => {
        const value = target[key];
        const progress = h("progress", {max: 1, value: 0, hidden: true});
        const picker = h("input", {
            type: "file", accept: "image/*,video/*,.glb", hidden: true,
            onchange: async (e) => {
                const file = e.target.files[0];
                if (!file) return;
                try {
                    target[key] = await withUpload(file, field.storage ?? "images", progress);
                    draw();
                } catch (err) {
                    toast(err.message, "error");
                }
            },
        });
        const dropZone = h("div", {
            class: "drop-zone",
            ondragover: (e) => { e.preventDefault(); dropZone.classList.add("over"); },
            ondragleave: () => dropZone.classList.remove("over"),
            ondrop: (e) => {
                e.preventDefault();
                dropZone.classList.remove("over");
                if (e.dataTransfer.files[0]) {
                    const dt = new DataTransfer();
                    dt.items.add(e.dataTransfer.files[0]);
                    picker.files = dt.files;
                    picker.dispatchEvent(new Event("change"));
                }
            },
        },
            value ? h("a", {class: "preview", href: mediaUrl(value), target: "_blank", rel: "noopener"}, renderThumb(value, "preview-media")) : h("div", {class: "preview empty"}, icon("image"), "Glisse un fichier ici"),
            h("div", {class: "file-meta"},
                value ? h("span", {class: "file-name", title: value}, displayName(value)) : null,
                h("div", {class: "file-actions"},
                    h("button", {type: "button", class: "btn small", onclick: () => picker.click()}, icon("upload"), value ? "Remplacer" : "Choisir un fichier"),
                    value ? h("button", {type: "button", class: "btn small text danger", onclick: () => { target[key] = null; draw(); }}, "Retirer") : null,
                ),
                progress,
            ),
            picker,
        );
        container.replaceChildren(dropZone);
    };
    draw();
    return container;
}

function renderFilesInput(field, target, key) {
    if (!Array.isArray(target[key])) target[key] = [];
    const container = h("div", {class: "files-input"});
    const draw = () => {
        const list = target[key];
        const progress = h("progress", {max: 1, value: 0, hidden: true});
        const picker = h("input", {
            type: "file", accept: "image/*,video/*", multiple: true, hidden: true,
            onchange: async (e) => {
                const files = [...e.target.files];
                for (const file of files) {
                    try {
                        list.push(await withUpload(file, field.storage ?? "images", progress));
                        draw();
                    } catch (err) {
                        toast(`${file.name} : ${err.message}`, "error");
                    }
                }
            },
        });
        const move = (i, delta) => {
            const j = i + delta;
            if (j < 0 || j >= list.length) return;
            [list[i], list[j]] = [list[j], list[i]];
            draw();
        };
        container.replaceChildren(
            h("div", {class: "files-grid"},
                list.map((path, i) => h("div", {class: "files-item"},
                    h("a", {href: mediaUrl(path), target: "_blank", rel: "noopener", title: displayName(path)}, renderThumb(path, "files-media")),
                    h("div", {class: "files-item-actions"},
                        h("button", {type: "button", class: "icon-btn small", title: "Avant", disabled: i === 0, onclick: () => move(i, -1)}, icon("chevron_left")),
                        h("span", {class: "muted small"}, i + 1),
                        h("button", {type: "button", class: "icon-btn small", title: "Après", disabled: i === list.length - 1, onclick: () => move(i, 1)}, icon("chevron_right")),
                        h("button", {type: "button", class: "icon-btn small danger", title: "Retirer", onclick: () => { list.splice(i, 1); draw(); }}, icon("close")),
                    ),
                )),
                h("button", {type: "button", class: "files-add", onclick: () => picker.click()}, icon("add_photo_alternate"), "Ajouter"),
            ),
            progress,
            picker,
        );
    };
    draw();
    return container;
}

function renderTagsInput(target, key) {
    if (!Array.isArray(target[key])) target[key] = [];
    const container = h("div", {class: "tags-input"});
    const draw = () => {
        const input = h("input", {
            type: "text", placeholder: "Ajouter un tag puis Entrée",
            onkeydown: (e) => {
                if ((e.key === "Enter" || e.key === ",") && input.value.trim()) {
                    e.preventDefault();
                    target[key].push(input.value.trim());
                    draw();
                    container.querySelector("input").focus();
                } else if (e.key === "Backspace" && !input.value && target[key].length) {
                    target[key].pop();
                    draw();
                    container.querySelector("input").focus();
                }
            },
        });
        container.replaceChildren(
            ...target[key].map((tag, i) => h("span", {class: "chip"}, tag, h("button", {type: "button", class: "chip-x", title: "Retirer", onclick: () => { target[key].splice(i, 1); draw(); }}, "×"))),
            input,
        );
    };
    draw();
    return container;
}

function renderBlocksInput(field, target, key) {
    if (!Array.isArray(target[key])) target[key] = [];
    const container = h("div", {class: "blocks-input"});
    const draw = () => {
        const list = target[key];
        const types = {...field.blockTypes};
        list.forEach((b) => b.type && !types[b.type] && (types[b.type] = b.type));
        const move = (i, delta) => {
            const j = i + delta;
            if (j < 0 || j >= list.length) return;
            [list[i], list[j]] = [list[j], list[i]];
            draw();
        };
        container.replaceChildren(
            ...list.map((block, i) => {
                const area = h("textarea", {rows: 3, oninput: (e) => { block.value = e.target.value; autoGrow(e.target); }}, block.value ?? "");
                requestAnimationFrame(() => autoGrow(area));
                return h("div", {class: "block"},
                    h("div", {class: "block-header"},
                        h("select", {onchange: (e) => (block.type = e.target.value)},
                            Object.entries(types).map(([v, label]) => h("option", {value: v, selected: v === block.type}, label))),
                        h("span", {class: "grow"}),
                        h("button", {type: "button", class: "icon-btn small", title: "Monter", disabled: i === 0, onclick: () => move(i, -1)}, icon("arrow_upward")),
                        h("button", {type: "button", class: "icon-btn small", title: "Descendre", disabled: i === list.length - 1, onclick: () => move(i, 1)}, icon("arrow_downward")),
                        h("button", {type: "button", class: "icon-btn small danger", title: "Supprimer", onclick: () => { list.splice(i, 1); draw(); }}, icon("delete")),
                    ),
                    area,
                );
            }),
            h("div", {class: "block-add"}, Object.entries(field.blockTypes).map(([v, label]) =>
                h("button", {type: "button", class: "btn small", onclick: () => { list.push({type: v, value: ""}); draw(); }}, icon("add"), label))),
        );
    };
    draw();
    return container;
}

// ── Réglages : comptes et sauvegardes ────────────────────────────────────────
async function openSettings() {
    const body = h("div", {class: "settings-body"}, h("p", {class: "muted"}, "Chargement…"));
    const overlay = h("div", {class: "dialog-overlay", onclick: (e) => e.target === overlay && overlay.remove()},
        h("div", {class: "dialog wide", role: "dialog", "aria-modal": "true"},
            h("header", {class: "dialog-header"}, h("h2", {}, "Réglages"), h("button", {class: "icon-btn", onclick: () => overlay.remove()}, icon("close"))),
            body,
        ),
    );
    document.body.append(overlay);

    const draw = async () => {
        try {
            const [{users}, {backups}] = await Promise.all([api("users"), api("backups")]);
            const newUser = h("input", {type: "text", placeholder: "Identifiant", autocomplete: "off"});
            const newPassword = h("input", {type: "password", placeholder: "Mot de passe (12 car. min.)", autocomplete: "new-password"});
            body.replaceChildren(
                h("h3", {}, "Comptes"),
                h("ul", {class: "simple-list"}, users.map((u) => h("li", {},
                    h("span", {}, u, u === state.user ? h("span", {class: "muted"}, " (toi)") : null),
                    u === state.user ? null : h("button", {
                        class: "btn small text danger", onclick: async () => {
                            if (!(await confirmDialog(`Supprimer le compte « ${u} » ?`, "Supprimer", true))) return;
                            await api("delete_user", {body: {username: u}}).catch((err) => toast(err.message, "error"));
                            draw();
                        },
                    }, "Supprimer"),
                ))),
                h("form", {
                    class: "inline-form", onsubmit: async (e) => {
                        e.preventDefault();
                        try {
                            await api("add_user", {body: {username: newUser.value.trim(), password: newPassword.value}});
                            toast("Compte enregistré", "success");
                            draw();
                        } catch (err) {
                            toast(err.message, "error");
                        }
                    },
                }, newUser, newPassword, h("button", {class: "btn primary small", type: "submit"}, "Ajouter / changer le mot de passe")),
                renderOptimizerSection(),
                h("h3", {}, "Sauvegardes"),
                h("p", {class: "muted small"}, "Une sauvegarde du contenu est créée avant chaque modification (100 dernières conservées)."),
                backups.length === 0 ? h("p", {class: "muted"}, "Aucune sauvegarde pour l'instant.") : h("ul", {class: "simple-list scroll"}, backups.map((b) => h("li", {},
                    h("span", {}, new Date(b.date).toLocaleString("fr-FR"), h("span", {class: "muted small"}, ` · ${(b.size / 1024).toFixed(0)} Ko`)),
                    h("button", {
                        class: "btn small text", onclick: async () => {
                            if (!(await confirmDialog("Restaurer cette version du contenu ? L'état actuel sera lui-même sauvegardé.", "Restaurer"))) return;
                            try {
                                await api("restore_backup", {body: {name: b.name}});
                                await loadContent();
                                overlay.remove();
                                render();
                                toast("Sauvegarde restaurée", "success");
                            } catch (err) {
                                toast(err.message, "error");
                            }
                        },
                    }, "Restaurer"),
                ))),
            );
        } catch (err) {
            body.replaceChildren(h("p", {class: "form-error"}, err.message));
        }
    };
    draw();
}

// ── Optimisation des images ──────────────────────────────────────────────────
function renderOptimizerSection() {
    const status = h("p", {class: "muted small"}, "Vérification…");
    const progress = h("progress", {max: 1, value: 0, hidden: true});
    const button = h("button", {class: "btn small", disabled: true}, icon("bolt"), "Optimiser les images manquantes");
    const forceButton = h("button", {class: "btn small text", disabled: true}, "Tout régénérer");

    const refresh = async () => {
        const s = await api("optimize_status");
        status.textContent = `${s.optimized} / ${s.images} images optimisées (variantes WebP 320 → 2560 px)` +
            (s.videos ? ` · ${s.videos} vidéos compressées` : "") + (s.pending ? ` · ${s.pending} en attente` : "");
        button.disabled = s.pending === 0;
        forceButton.disabled = false;
        return s;
    };

    const runBatches = async (force) => {
        button.disabled = forceButton.disabled = true;
        progress.hidden = false;
        let offset = 0, total = null, errors = [];
        try {
            while (true) {
                const r = await api("optimize_batch", {body: {force, offset}});
                errors = errors.concat(r.errors);
                total ??= r.processed + r.remaining;
                offset = r.nextOffset;
                progress.value = total ? (total - r.remaining) / total : 1;
                status.textContent = `Optimisation… ${total - r.remaining} / ${total}`;
                if (r.remaining === 0 || r.processed === 0) break;
            }
            toast(errors.length ? `${errors.length} image(s) illisible(s)` : "Images optimisées", errors.length ? "error" : "success");
            if (errors.length) console.warn(errors);
            await loadManifest();
        } catch (err) {
            toast(err.message, "error");
        }
        progress.hidden = true;
        refresh().catch(() => null);
    };

    button.addEventListener("click", () => runBatches(false));
    forceButton.addEventListener("click", async () => {
        if (await confirmDialog("Régénérer toutes les variantes ? Cela peut prendre plusieurs minutes.", "Régénérer")) runBatches(true);
    });
    refresh().catch((err) => (status.textContent = err.message));

    return h("div", {},
        h("h3", {}, "Optimisation des images"),
        h("p", {class: "muted small"}, "Chaque image envoyée est automatiquement déclinée en WebP à plusieurs largeurs ; le site sert la plus adaptée à l'écran. Les originaux ne sont jamais modifiés."),
        status, progress,
        h("div", {class: "file-actions"}, button, forceButton),
    );
}

// ── Démarrage ────────────────────────────────────────────────────────────────
async function loadManifest() {
    state.manifest = await fetch("/data/media.json", {cache: "no-cache"}).then((r) => (r.ok ? r.json() : null)).catch(() => null);
}

async function loadContent() {
    const [{content}] = await Promise.all([api("content"), loadManifest()]);
    state.content = content;
}

window.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && state.editor && !document.querySelector(".dialog-overlay")) closeEditor();
});
window.addEventListener("beforeunload", (e) => {
    if (state.editor && (JSON.stringify(state.editor.draft) !== state.editor.original || state.editor.uploading > 0)) {
        e.preventDefault();
    }
});

(async () => {
    try {
        const session = await api("session");
        state.user = session.user;
        state.csrf = session.csrf;
        state.needsSetup = session.needsSetup;
        if (state.user) await loadContent();
    } catch (err) {
        app.replaceChildren(h("p", {class: "form-error boot-error"}, `Impossible de joindre l'API : ${err.message}`));
        return;
    }
    render();
})();
