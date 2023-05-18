import React, { ReactElement } from 'react';
import { default as AntForm } from 'antd/lib/form';
import Input, { TextAreaProps, InputProps } from 'antd/lib/input';
import Radio, { RadioGroupProps, RadioProps } from 'antd/lib/radio';
import DatePicker from 'antd/lib/date-picker'
import Checkbox, { CheckboxGroupProps, CheckboxProps } from 'antd/lib/checkbox';
import Row from 'antd/lib/row'
import Col from 'antd/lib/col'
import InputNumber, { InputNumberProps } from 'antd/lib/input-number';
import { SelectProps } from 'antd/lib/select';
import { getFieldsByPath } from '@tmind/utils';
import TSelect, {
  SelectCompolexOption,
  ISelectOption,
  SelectSearchType,
  SelectLoadMoreParam,
} from '../TSelect';
import './index.scss'
import { getClassName } from '../util';

const classname = (n: string = '') => {
  const cn = 't-from'
  return getClassName(cn, n);
};

declare const FormItemTypes: [
  'input',
  'inputNumber',
  'text',
  'password',
  'radio',
  'select',
  'checkbox',
  'datePicker',
  'rangePicker'
];
export type FormItemType = typeof FormItemTypes[number];

export declare type FormItemLayout = { span?: number; offset?: number };

export type GetPropFunc<T> = (item: T) => { [key: string]: any };

export type CompolexOption<T> = {
  datasource: T[];
  id?: string;
  name?: string;
  props?: GetPropFunc<T>;
};
export interface IFormBaseItem {
  /**
   * 属性名
   */
  id: string;
  /**
   * label名称
   */
  label: string;
  /**
   * 组件是否禁用
   */
  disabled?: boolean;
  /**
   * form类型 FORM_TYPE
   */
  type?: FormItemType;
  /**
   * decoratorOption中的初始值，如果decoratorOptions中设置了，此配置无效
   */
  initialValue?: any;
  /**
   * require/whitespace的验证消息， 不填写则不验证
   */
  required?: string;
  /**
   * rule-max, 正则，验证消息
   */
  pattern?: [RegExp, string];
  /**
   * rule-validator 自定义验证
   */
  validator?: (
    rule: any,
    value: any,
    callback: (errMessage?: string) => void
  ) => void;
  /**
   * 自定义form
   */
  render?: (form: any) => ReactElement;
  /**
   * getFieldDecorator的options参数
   */
  decoratorOptions?: any;
  /**
   * item组件的其他属性
   */
  props?: any;
  /**
   * Antd Form.Item 的其他属性
   */
  formItemProps?: any;

  /**
   *  FormItem layout， 默认为 {labelCol:{span: 7}, wrapperCol: {span: 7}}
   * @type {{labelCol: FormItemLayout, wrapperCol: FormItemLayout}}
   * @memberof FormItem
   */
  itemLayout?: { labelCol: FormItemLayout; wrapperCol: FormItemLayout };
}

export interface IFormGridProp {
  /**
   * 一行显示几个label 默认1个, 其他：2, 3
   */
  column?: 1 | 2 | 3;
  /**
   * 需要的数据: [ { lable: ...,id: ..., required: ..., type: ..., ... }, ... ]
   */
  formItems: IFormItem[];

  form?: any;

  /**
   * 全局 FormItem layout， 默认为 {labelCol:{span: 7}, wrapperCol: {span: 7}}
   * @type {{labelCol: FormItemLayout, wrapperCol: FormItemLayout}}
   * @memberof FormItem
   */
  itemLayout?: { labelCol: FormItemLayout; wrapperCol: FormItemLayout };

  className?: string;
  style?: any;
  id?: any;
}

export interface IFormInputItem extends IFormBaseItem {
  props?: InputProps;
  placeholder?: string;
  maxLength?: number;
}
export interface IFormInputNumItem extends IFormBaseItem {
  props?: InputNumberProps;
  placeholder?: string;
  maxLength?: number;
}

export interface IFormTextItem extends IFormBaseItem {
  props?: TextAreaProps;
  placeholder?: string;
  maxLength?: number;
}

export interface IFormItemOption<T = any> {
  id?: string | number;
  name?: string | number;
  disabled?: boolean;
  /**
   * CheckBox/Select/Radio Item的其他属性
   */
  props?: RadioProps | CheckboxProps | GetPropFunc<T>;
}

export interface IFormRadioGroupItem<T = any> extends IFormBaseItem {
  props?: RadioGroupProps;
  /**
   * 单选数据
   */
  options?: Array<IFormItemOption<T>> | CompolexOption<T>;
}

export interface IFormChkBoxGroupItem<T = any> extends IFormBaseItem {
  props?: CheckboxGroupProps;
  /**
   * 多选数据
   */
  options?: Array<IFormItemOption<T>> | CompolexOption<T>;
}

export interface IFormSelectItem<T = any> extends IFormBaseItem {
  props?: SelectProps<T>;

  placeholder?: string;
  /**
   * 下拉数据
   */
  options: Array<ISelectOption<T>> | SelectCompolexOption<T>;
  /**
   * 如果设置，不为undefined , 则显示‘全部', 且key=设置的值
   */
  optionAll?:
  | boolean
  | string
  | number
  | undefined
  | null
  | { name: string; value: string | number | undefined };

  search?: SelectSearchType;

  loadMore?: SelectLoadMoreParam;
}

export type IFormItem =
  | IFormInputItem
  | IFormInputNumItem
  | IFormSelectItem
  | IFormChkBoxGroupItem
  | IFormRadioGroupItem
  | IFormTextItem;

const { RangePicker } = DatePicker;

class FormGrid extends React.PureComponent<IFormGridProp> {
  static defaultProps = {
    column: 1,
  };
  private getOptionsArray(
    options?: Array<IFormItemOption<any>> | CompolexOption<any>
  ): IFormItemOption[] {
    if (Array.isArray(options)) {
      return options;
    } else if (typeof options === 'object') {
      if (!options.datasource || !Array.isArray(options.datasource)) {
        throw new Error('option 未配置datasource');
      }
      const namePath = options.name || 'name';
      const idPath = options.id || 'id';
      return options.datasource.map((data: any) => {
        return {
          id: getFieldsByPath(data, idPath),
          name: getFieldsByPath(data, namePath),
          disabled: data.disabled,
          props: () => {
            return options.props ? options.props(data) : {};
          },
        };
      });
    } else {
      return [];
    }
  }
  private getOptionProps: (data: any, props: any) => { [key: string]: any } = (
    data,
    props
  ) => {
    if (!props) {
      return {};
    }

    if (typeof props === 'function') {
      props = props(data);
    }
    return props || {};
  };
  private input = (item: IFormInputItem) => (
    <Input
      disabled={item.disabled}
      maxLength={item.maxLength}
      {...item.props}
      placeholder={item.placeholder || '请输入'}
    />
  );

  private password = (item: IFormInputItem) => (
    <Input.Password
      disabled={item.disabled}
      {...item.props}
      placeholder={item.placeholder || '请输入'}
    />
  );

  private text = (item: IFormTextItem) => (
    <Input.TextArea
      disabled={item.disabled}
      maxLength={item.maxLength}
      {...item.props}
      placeholder={item.placeholder || '请输入'}
    />
  );

  private inputNumber = (item: IFormInputNumItem) => (
    <InputNumber
      disabled={item.disabled}
      maxLength={item.maxLength}
      {...item.props}
    />
  );

  private datePicker = (item: IFormBaseItem) => (
    <DatePicker disabled={item.disabled} {...item.props} />
  );

  private rangePicker = (item: IFormBaseItem) => (
    <RangePicker disabled={item.disabled} {...item.props} />
  );

  private select = (item: IFormSelectItem) => {
    return (
      <TSelect
        {...item.props}
        disabled={item.disabled}
        search={item.search}
        optionAll={item.optionAll}
        loadMore={item.loadMore}
        options={item.options}
        placeholder={item.placeholder}
      />
    );
  };

  private radio = (item: IFormRadioGroupItem) => {
    return (
      <Radio.Group disabled={item.disabled} {...item.props}>
        {this.getOptionsArray(item.options).map((ele: any) => (
          <Radio
            key={ele.id}
            disabled={ele.disabled}
            value={ele.id}
            {...this.getOptionProps(ele, ele.props)}
          >
            {ele.name}
          </Radio>
        ))}
      </Radio.Group>
    );
  };
  private checkbox = (item: IFormChkBoxGroupItem) => {
    return (
      <Checkbox.Group disabled={item.disabled} {...item.props}>
        {this.getOptionsArray(item.options).map((ele: any) => (
          <Checkbox
            key={ele.id}
            disabled={ele.disabled}
            value={ele.id}
            {...this.getOptionProps(ele, ele.props)}
          >
            {ele.name}
          </Checkbox>
        ))}
      </Checkbox.Group>
    );
  };

  private renderItem(form: any, item: IFormBaseItem) {
    if (item.render) {
      return item.render(form);
    }
    if (item && item.type && this[item.type]) {
      //@ts-ignore
      return this[item.type](item);
    }

    throw new Error('neigher type or render is set for FormGroupItem');
  }

  private renderFormItem = (item: IFormBaseItem) => {
    const decoratorOptions = {
      initialValue: item.initialValue,
      ...item.decoratorOptions,
    };
    const rules = [];
    if (item.required) {
      rules.push({ required: true, message: item.required });
      if (
        item.type === 'input' ||
        item.type === 'inputNumber' ||
        item.type === 'text' ||
        item.type === 'password'
      ) {
        if (item.type !== 'inputNumber') {
          // @ts-ignore
          rules[rules.length - 1].whitespace = true;
        }
        if (
          decoratorOptions.initialValue !== undefined &&
          decoratorOptions.initialValue != null
        ) {
          // 使用whiteSpace的时候必须要传传入字符串，如果是数字，第一次的初始值会导致验证出错
          decoratorOptions.initialValue = `${decoratorOptions.initialValue}`;
        }
      }
    }
    if (item.pattern) {
      rules.push({ pattern: item.pattern[0], message: item.pattern[1] });
    }

    if (item.validator) {
      const validatorFunc = (
        rule: any,
        value: any,
        callback: (errorMessage?: string) => void
      ) => {
        function callbackWrap(message?: string) {
          if (!message) {
            callback();
          } else {
            rule.message = message;
            callback(rule.message);
          }
        }
        if (item.validator) {
          item.validator(rule, value, callbackWrap);
        } else {
          callback();
        }
      };
      rules.push({
        validator: validatorFunc,
        message: '请在callback前设置rule.message',
      });
    }
    const decRules = item.decoratorOptions
      ? item.decoratorOptions.rules || []
      : [];
    decoratorOptions.rules = [...rules, ...decRules];

    const { itemLayout } = this.props;

    const formItemLayout = {
      labelCol: { span: 7 },
      wrapperCol: { span: 17 },
      ...itemLayout,
      ...item.itemLayout,
    };
    return (
      <AntForm.Item
        label={item.label}
        name={item.id}
        rules={rules}
        initialValue={item.initialValue}
        {...formItemLayout}
        {...item.formItemProps}
      >
        {this.renderItem(this.props.form, item)}
      </AntForm.Item>
    );
  };

  render() {
    const { formItems, id, className, style } = this.props;
    let { column } = this.props;
    column = column || 1;
    const rows = [];
    const rowCnt = formItems.length / column;
    for (let row = 0; row < rowCnt; row++) {
      const colStart = row * column;
      const cols = [];
      for (let col = 0; col < column; col++) {
        const itemIdx = colStart + col;
        if (itemIdx >= formItems.length) {
          break;
        }
        const item = formItems[itemIdx];
        cols.push(
          <Col key={`col-${col}`} span={24 / column}>
            <div className={classname('item-wrapper')}>
              {this.renderFormItem(item)}
            </div>
          </Col>
        );
      }
      rows.push(
        <Row key={`row-${rows.length}`} align="top">
          {cols}
        </Row>
      );
    }
    return (
      <div
        id={id}
        className={`${classname('grid')} ${className || ''}`}
        style={style}
      >
        {rows}
      </div>
    );
  }
}

export interface IFormProps extends IFormGridProp {
  gridClassName?: string;
  gridStyle?: any;
  gridId?: any;
}

const TForm = React.forwardRef((props: IFormProps, ref) => {
  return (
    <AntForm ref={ref as any} {...props}>
      <FormGrid
        id={props.gridId}
        className={props.gridClassName || ''}
        style={props.gridStyle}
        formItems={props.formItems}
        column={props.column || 1}
        form={props.form}
        itemLayout={props.itemLayout}
      />
    </AntForm>
  );
});

// interface IForm extends FormProps  {
//   FormGrid: typeof FormGrid;
// }

// @ts-ignore
// const FormImpl: IForm = Form;

//FormImpl.FormGrid = FormGrid;
export default TForm;
