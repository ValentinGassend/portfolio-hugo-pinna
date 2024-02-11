const PartTitle = ({ParentClass, titleText, scrollable = true}) => {
    return (<div className={`${ParentClass}-headline${scrollable ? ' partTitle' : ''}`}>
            <h1 className={`${ParentClass}-headline--title partTitle--title`}>{titleText ? titleText : ParentClass}</h1>
        </div>)
}
export default PartTitle