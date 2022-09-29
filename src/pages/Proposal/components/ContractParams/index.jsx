/**
 * @file contract params input
 * @author atom-yang
 */
import React, { useMemo, useState } from 'react';
import moment from 'moment';
import {
  DatePicker,
  Input,
  Checkbox,
  Button,
  Form,
} from 'antd';
import PropTypes from 'prop-types';
import {
  rand16Num,
  getParams,
} from '../../common/utils';
import './index.less';

const FormItem = Form.Item;

function flatMapForm(obj, prefix = '') {
  return Object.keys(obj).reduce((acc, key) => {
    if (!obj[key].type) {
      return {
        ...acc,
        ...flatMapForm(obj[key], `${key}.`),
      };
    }
    return {
      ...acc,
      [`${prefix}${obj[key].name}`]: obj[key],
    };
  }, {});
}

const RepeatedForm = (props) => {
  const {
    formKey,
    Comp,
    formOption,
    layout,
  } = props;
  const [list, setList] = useState([rand16Num(8)]);
  const deleteItem = (index) => {
    setList(list.filter((_, i) => i !== index));
  };
  const addItem = () => {
    setList([...list, rand16Num(8)]);
  };
  return (
    <div className="repeated-form">
      {list.map((v, i) => (
        <FormItem
          {...layout}
          key={v}
          label={formKey}
          className="repeated-form-item"
          name={`${formKey}[${i}]`}
          {...formOption}
        >
          {
            Comp
          }
          <Button
            onClick={() => deleteItem(i)}
            className="gap-left"
          >
            X
          </Button>
        </FormItem>
      ))}
      <FormItem
        {...layout}
      >
        <Button type="primary" onClick={addItem}>Add</Button>
      </FormItem>
    </div>
  );
};
RepeatedForm.propTypes = {
  name: PropTypes.string.isRequired,
  Comp: PropTypes.node.isRequired,
  formOption: PropTypes.shape({
    initialValue: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.object,
      PropTypes.bool,
      PropTypes.number,
    ]),
    getValueFromEvent: PropTypes.func,
  }).isRequired,
  // eslint-disable-next-line react/forbid-prop-types
  layout: PropTypes.object.isRequired,
  formKey: PropTypes.string.isRequired,
};

const INPUT_TYPE_FROM_ITEM_MAP = {
  '.google.protobuf.Timestamp': {
    Comp: (props) => (
      <DatePicker
        showTime
        placeholder="Please select time"
        {...props}
      />
    ),
    form: {
      initialValue: moment(),
    },
  },
  bool: {
    Comp: (props) => (
      <Checkbox {...props} />
    ),
    form: {
      initialValue: false,
      valuePropName: 'checked',
    },
  },
  default: {
    Comp: (props) => (
      <Input {...props} />
    ),
    form: {
      initialValue: '',
    },
  },
};

const formItemsKeys = Object.keys(INPUT_TYPE_FROM_ITEM_MAP);

const ContractParams = (props) => {
  const {
    inputType,
    layout = {},
  } = props;
  const formDescriptor = useMemo(() => getParams(inputType), [inputType]);
  const flattedFormDescriptor = useMemo(() => flatMapForm(formDescriptor), [formDescriptor]);
  return (
    <div className="proposal-contract-params gap-bottom-large">
      {Object.keys(flattedFormDescriptor).map((key) => {
        const {
          type,
          name,
          repeated,
        } = flattedFormDescriptor[key];
        const index = formItemsKeys.indexOf(type);
        const item = index === -1 ? INPUT_TYPE_FROM_ITEM_MAP.default : INPUT_TYPE_FROM_ITEM_MAP[formItemsKeys[index]];
        const {
          Comp,
          form,
        } = item;
        if (repeated === true) {
          return (
            <RepeatedForm
              key={key}
              formKey={key}
              layout={layout}
              name={name}
              Comp={<Comp />}
              formOption={form}
            />
          );
        }
        return (
          <FormItem
            key={key}
            label={key}
            {...layout}
          >
            <Comp />
          </FormItem>
        );
      })}
      {Object.keys(flattedFormDescriptor).length === 0 ? (
        <FormItem
          {...layout}
        >
          <span className="small-tip">Empty Contract Method Parameter</span>
        </FormItem>
      ) : null}
    </div>
  );
};

ContractParams.propTypes = {
  // value: PropTypes.shape({
  //   original: PropTypes.oneOfType([
  //     PropTypes.string,
  //     PropTypes.object
  //   ]),
  //   decoded: PropTypes.string
  // }),
  // onChange: PropTypes.func.isRequired,
  inputType: PropTypes.shape({
    fields: PropTypes.object,
  }),
  // eslint-disable-next-line react/forbid-prop-types
  layout: PropTypes.object.isRequired,
};
ContractParams.defaultProps = {
  inputType: {
    fields: {},
  },
};

export default ContractParams;
