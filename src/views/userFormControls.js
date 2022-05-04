import { ref,reactive } from 'vue'

export default function userFormControls(formColsData = []) {
  // 深克隆
  const deepClone = (obj, hash = new WeakMap()) => {
    if (hash.has(obj)) {
      return obj;
    }
    let res = null;
    const reference = [Date, RegExp, Set, WeakSet, Map, WeakMap, Error];

    if (reference.includes(obj?.constructor)) {
      res = new obj.constructor(obj);
    } else if (Array.isArray(obj)) {
      res = [];
      obj.forEach((e, i) => {
        res[i] = deepClone(e);
      });
    } else if (typeof obj === "object" && obj !== null) {
      res = {};
      for (const key in obj) {
        if (Object.hasOwnProperty.call(obj, key)) {
          res[key] = deepClone(obj[key]);
        }
      }
      hash.set(obj, res);
    } else {
      res = obj;
    }
    return res;
  }

  const deepFormColsData = deepClone(formColsData);
  const formDataType = reactive({})

  // 设置必填规则
  const setFormRequiredRules = (arr) => {
    arr.forEach(item => {
      if (item.required && item.prop) {
        item.rules = [{ required: true, message: (item.label || item.prop) + '为必填项，请' + (item.eType === 'Input' ? '输入' : '选择') + '！', trigger: 'blur' }]
      }
      if (item.child) {
        setFormRequiredRules(item.child)
      }
    })
  }
  setFormRequiredRules(deepFormColsData)

  // 处理数据类型对数值类型做校检
  const setFormDataType = (arr) => {
    arr.forEach(item => {
      if (item.dataType && item.prop) {
        formDataType[item.prop] = item.dataType
        if(item.rules) {
          item.rules.push({ pattern: /^[0-9]*$/, message: '请输入数字'})
        }else {
          item.rules=[{ pattern: /^[0-9]*$/, message: '请输入数字' }]
        }
      }
      if (item.child) {
        setFormDataType(item.child)
      }
    })
  }
  setFormDataType(deepFormColsData)

  const formOptions = ref(deepFormColsData)

  const setForm = (arr, prop, key, value) => {
    arr.forEach(item => {
      if (item.prop === prop) {
        item[key] = value
      }
      if (item.child) {
        setForm(item.child, prop, key, value)
      }
    })
  }
  const setFormNoShow = (props, isShow) => {
    props.forEach(item => {
      setForm(formOptions.value, item, 'noShow', isShow)
    })
  }


  console.log(formOptions.value);
  return {
    formOptions,
    formDataType,
    setFormNoShow
  }

}
