const PartTitle = ({ParentClass, isEnterSmooth=false, titleText, scrollable = true}) => {
    return (<div className={`${ParentClass}-headline ${isEnterSmooth ? "EnterSmoothScroll":""}  partTitle ${scrollable ? '' : ' disable'}`}>
            <h1 className={`${ParentClass}-headline--title partTitle--title`}>{titleText ? titleText : ParentClass}</h1>
        </div>)
}
export default PartTitle