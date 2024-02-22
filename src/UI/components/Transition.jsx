import {motion} from "framer-motion"

const Transition = (Page) => {
    const variants = {
        hidden: { opacity: 0, x: -200, y: 0 },
        enter: { opacity: 1, x: 0, y: 0 },
    }
    return () => (<>
        {/*<Page />*/}

        <motion.div exit={{ opacity: 0 }}>
            <Page />

        </motion.div>

    </>)



}
export default Transition;