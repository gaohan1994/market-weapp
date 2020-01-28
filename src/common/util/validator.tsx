/**
 * @Author: Ghan 
 * @Date: 2019-10-04 15:38:23 
 * @Last Modified by: Ghan
 * @Last Modified time: 2019-11-08 11:23:06
 * 
 * @todo [策略模式校验工具]
 * @Usage
 * ```js
 * const helper = new Validator();
 * helper.add(this.state.value, [{
 *  strategy: strategyName,
 *  errorMsg: '',
 * }]);
 * 
 * const result = helper.start();
 * ```
 */

const strategies: any = {
  /**
   * @todo 非空校验
   * @param value 
   * @param errorMsg 
   * @param elementName 
   */
  isNonEmpty(value: any, errorMsg: any, elementName: any) {
    return value === '' || value.length === 0 ? {
      name: elementName,
      msg: errorMsg,
    } : void 0;
  },

  /**
   * @todo 手机格式校验
   * @param value 
   * @param errorMsg 
   * @param elementName 
   */
  isNumberVali(value: any, errorMsg: any, elementName: any) {
    return (!(new RegExp('^[0-9]*$').test(value))) ? {
      name: elementName,
      msg: errorMsg,
    } : void 0;
  },

  /**
   * @todo 长度校验
   * @param value  
   * @param errorMsg 
   * @param elementName 
   * @param args 
   */
  checkValueLength(value: any, errorMsg: any, elementName: any, args: any) {
    return value.length >= args.validLength ? void 0 : {
        name    : elementName,
        msg  : errorMsg,
    };
  },

  /**
   * @todo 相等校验
   * @param value  
   * @param errorMsg 
   * @param elementName 
   */
  isEqual(value: any, errorMsg: any, elementName: any) {
    return value[0] === value[1] ? void 0 : {
      name: elementName,
      msg: errorMsg,
    };
  },

  isValiType(value: any, errorMsg: any, elementName: any) {
    return value === -1 ? {
      name: elementName,
      msg: errorMsg,
    } : void 0;
  },
};

interface ValidatorRule {
  strategy: string;
  errorMsg: string;
  elementName?: any;
  args?: any;
}

class Validator {
  
  private cache: any;
  
  constructor () {
    /*缓存校验规则*/
    this.cache  = [];
    this.add    = this.add.bind(this);
    this.start  = this.start.bind(this);
  }

  public add = (value: any, rules: ValidatorRule[]) => {
    rules.map((rule: ValidatorRule) => {
      let strategyAry: any = rule.strategy.split(':');
      let errorMsg = rule.errorMsg;
      let elementName = rule.elementName;
      let args = rule.args;

      this.cache.push(() => {
          
        let strategy = strategyAry.shift();
        
        strategyAry.unshift(value);

        strategyAry.push(errorMsg);

        strategyAry.push(elementName);

        strategyAry.push(args);
        
        return strategies[strategy].apply(value, strategyAry);
      });
    });
  }

  public start = () => {
    for (let validatorFunc of this.cache) {
      /* 开始校验并取得校验后的信息 */
      let errorMsg = validatorFunc(); 

      if (errorMsg) {
        return errorMsg;
      }
    }
  }
}

export default Validator;