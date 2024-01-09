const PartTitle = ({ParentClass, titleText}) => {
    return (
        <div className={`${ParentClass}-headline partTitle`}>
            <h1 className={`${ParentClass}-headline--title partTitle--title`}>{titleText ? titleText : ParentClass}</h1>
        </div>
    )
}
export default PartTitle