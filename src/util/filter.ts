type Logic = 'AND' | 'OR' | 'XOR' | 'NAND' | 'NOR' | 'WHERE'
type NumericOperation = 'eq' | '!eq' | 'gt' | 'gte' | 'lt' | 'lte'
type StringOperation =
  | 'contains'
  | '!contains'
  | 'is'
  | '!is'
  | 'isEmpty'
  | '!isEmpty'
type AddressOperation = 'is' | '!is' | 'isEmpty' | '!isEmpty'
type FilterDataTypes = 'String' | 'Address' | 'Number'
type FilterOpertationType =
  | NumericOperation
  | StringOperation
  | AddressOperation
import * as yup from 'yup'

export type FilterCondition = {
  logic?: Logic
  key: string
  type: FilterDataTypes
  operation: FilterOpertationType
  constant: string | number
}

export type ConditionGroup = {
  logic: Logic
  conditions: FilterCondition[]
}

export type FilterConfig = ConditionGroup[]

export class Filter {
  public static version() {
    return 'v1'
  }

  public static execute(record: any, groupsIn: FilterConfig, _version = 'v1') {
    // Deep copy to so we can edit the object during recursion
    const groups = JSON.parse(JSON.stringify(groupsIn))

    let lhs = true
    for (const group of groups) {
      const rhs = Filter.process(record, group.conditions)
      lhs = Filter.execLogic(lhs, group.logic, rhs)
    }
    return lhs
  }

  private static process(
    record: any,
    conditions: FilterCondition[],
    lhs?: boolean
  ): boolean {
    const condition = conditions.shift()
    if (!condition) {
      if (lhs === undefined) {
        return true
      }
      return lhs
    }

    // lhs <logic> rhs
    const rhs = Filter.execCondition(record, condition)
    if (lhs === undefined || condition.logic === 'WHERE') {
      return Filter.process(record, conditions, rhs)
    }
    if (condition.logic === undefined) {
      throw new Error('Invalid filter. FilterCondition must have logic value')
    }

    const next = Filter.execLogic(lhs, condition.logic, rhs)
    return Filter.process(record, conditions, next)
  }

  private static execLogic(lhs: boolean, logic: Logic, rhs: boolean): boolean {
    switch (logic) {
      case 'AND':
        return lhs && rhs
      case 'OR':
        return lhs || rhs
      case 'XOR':
        return (lhs || rhs) && !(lhs && rhs)
      case 'NAND':
        return !(lhs && rhs)
      case 'NOR':
        return !(lhs && rhs)
      case 'WHERE':
        return rhs
      default:
        throw new Error(`Invalid Filter. Bad logic value: ${logic}`)
    }
  }

  private static execCondition(
    record: any,
    condition: FilterCondition
  ): boolean {
    const data = record[condition.key]
    if (condition.type === 'Number') {
      if (typeof condition.constant !== 'number' || typeof data !== 'number') {
        throw new Error(
          `Invalid filter. Type miss-match. Type: ${condition.type}, Variable: ${condition.constant}, Data: ${data}`
        )
      }
      const n = data as number
      const constant = condition.constant as number

      switch (condition.operation) {
        case 'eq':
          return n === constant
        case '!eq':
          return n !== constant
        case 'gt':
          return n > constant
        case 'gte':
          return n >= constant
        case 'lt':
          return n < constant
        case 'lte':
          return n <= constant
        default:
          throw new Error('Invalid Filter. Operation does not match type')
      }
    }

    if (condition.type === 'String') {
      if (typeof condition.constant !== 'string' || typeof data !== 'string') {
        throw new Error(
          `Invalid filter. Type miss-match. Type: ${condition.type}, Variable: ${condition.constant}, Data: ${data}`
        )
      }
      const str = data as string
      const constant = condition.constant as string

      switch (condition.operation) {
        case 'contains':
          return str.includes(constant)
        case '!contains':
          return !str.includes(constant)
        case 'is':
          return str === constant
        case '!is':
          return str !== constant
        case 'isEmpty':
          return str === ''
        case '!isEmpty':
          return str !== ''
        default:
          throw new Error('Invalid Filter. Operation does not match type')
      }
    }

    if (condition.type === 'Address') {
      if (typeof condition.constant !== 'string' || typeof data !== 'string') {
        throw new Error(
          `Invalid filter. Type miss-match. Type: ${condition.type}, Variable: ${condition.constant}, Data: ${data}`
        )
      }
      const str = data as string
      const constant = condition.constant as string

      switch (condition.operation) {
        case 'contains':
          return str.toLowerCase().includes(constant.toLowerCase())
        case '!contains':
          return !str.toLowerCase().includes(constant.toLowerCase())
        case 'is':
          return str.toLowerCase() === constant.toLowerCase()
        case '!is':
          return str.toLowerCase() !== constant.toLowerCase()
        case 'isEmpty':
          return str === ''
        case '!isEmpty':
          return str !== ''
        default:
          throw new Error('Invalid Filter. Operation does not match type')
      }
    }
    throw new Error('Invalid Filter. Unknown Type')
  }
}

export class FilterBuilder {
  private groups: ConditionGroup[] = []
  constructor() {
    this.newGroup('WHERE')
  }

  public static version() {
    return Filter.version()
  }

  public static new(): FilterBuilder {
    return new FilterBuilder()
  }

  public newGroup(logic: Logic): FilterBuilder {
    if (this.groups.length !== 0 && logic === 'WHERE') {
      throw new Error('Only the first groups can start with "WHERE"')
    }

    this.groups.push({ logic: 'WHERE', conditions: [] })
    return this
  }

  public addCondition(
    logic: Logic,
    key: string,
    type: FilterDataTypes,
    operation: FilterOpertationType,
    constant: string | number
  ): FilterBuilder {
    const group = this.groups[this.groups.length - 1]
    if (group.conditions.length === 0 && logic !== 'WHERE') {
      throw new Error(
        'Logic for the first condition of a group must be "WHERE"'
      )
    }

    if (group.conditions.length > 0 && logic === 'WHERE') {
      throw new Error('Only the first condition of a group can be "WHERE"')
    }

    group.conditions.push({
      logic,
      key,
      type,
      operation,
      constant
    })

    return this
  }

  public finalise() {
    for (const group of this.groups) {
      if (group.conditions.length === 0) {
        throw new Error(
          'Bad Filter. All Groups must have atleast one condition'
        )
      }
    }
    return this.groups
  }

  public static schema() {
    const logic = yup
      .string()
      .oneOf(['AND', 'OR', 'XOR', 'NAND', 'NOR', 'WHERE'])
      .required()
    const condition = yup.object({
      logic,
      key: yup.string().required(),
      type: yup.string().oneOf(['String', 'Address', 'Number']).required(),
      operation: yup.string().when('type', ([type], schema) => {
        switch (type) {
          case 'String':
            return schema.oneOf([
              'contains',
              '!contains',
              'is',
              '!is',
              'isEmpty',
              '!isEmpty'
            ])
          case 'Address':
            return schema.oneOf(['is', '!is', 'isEmpty', '!isEmpty'])
          case 'Number':
            return schema.oneOf(['String', 'Address', 'Number'])
          default:
            throw new Error('Invalid Filter Data Type')
        }
      }),
      constant: yup.mixed().when('type', ([type]) => {
        switch (type) {
          case 'String':
            return yup.string()
          case 'Address':
            return yup.string()
          case 'Number':
            return yup.number()
          default:
            throw new Error('Invalid Filter Data Type')
        }
      })
    })

    return yup.array().of(
      yup.object({
        logic,
        conditions: yup.array().of(condition)
      })
    )
  }
}
