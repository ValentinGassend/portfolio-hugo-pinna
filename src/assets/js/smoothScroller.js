let panels = gsap.utils.toArray('.panel');

panels.forEach((panel, i) => {
    snapTriggers.current[i] = ScrollTrigger.create({
        trigger: panel,
        start: "top top"
    });
});

// once all the triggers have calculated their start/end, create the snap function that'll accept an overall progress value for the overall page, and then return the closest panel snapping spot based on the direction of scroll
ScrollTrigger.addEventListener("refresh", () => {
    scrollStarts = snapTriggers.current.map(trigger => trigger.start); // build an Array with just the starting positions where each panel hits the top of the viewport
    snapScroll = ScrollTrigger.snapDirectional(scrollStarts); // get a function that we can feed a pixel-based scroll value to and a direction, and then it'll spit back the closest snap position (in pixels)
});

ScrollTrigger.observe({
    type: "wheel,touch",
    onChangeY(self) {
        if (!scrollTween.current) {
            // find the closest snapping spot based on the direction of scroll
            let scroll = snapScroll(self.scrollY() + self.deltaY, self.deltaY > 0 ? 1 : -1);
            goToSection(scrollStarts.indexOf(scroll)); // scroll to the index of the associated panel
        }
    }
});

ScrollTrigger.refresh();
