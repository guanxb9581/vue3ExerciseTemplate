

// export type CompType = 'input' | 'select' | 'radio'
export type CompType = string

export type SelectOptions = {
  label: string
  value: string | number
}

export type TableConfig = {
  key: string // item对应的key
  label: string // 表格title和搜索栏label文案
  valueType: 'string' | 'number' // 传值类型
  compType: CompType // 组件类型
  options?: Array<SelectOptions> // 下拉框选择项
  needFilter: Boolean // 是否需要为这一列设置过滤
  renderFunc?: any
}

export type TableColumn = Pick<TableConfig, 'key' | 'label' | 'renderFunc'> & {
  width: number,
}