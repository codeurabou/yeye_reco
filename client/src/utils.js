// TODO : APP REGEXP

const REG_EXP = {

}

const adaptSelect = (data = [], vAttr = "", lAttr = "") => {
    const datas = data.map((d) => {
        d.value = d[vAttr]
        d.label = d[lAttr]
        return d
    })
    return datas
}

export { adaptSelect }
