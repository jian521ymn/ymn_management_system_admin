// 封装的一些方法

/**
 * promise版form.validate
 * @params {this,name}
*/
export function formValidate(that,name){
    let _that =that;
    return new Promise(function(resolve,reject){
        try {
            _that.$refs[name].validate((vaild)=>{
                resolve(vaild)
            })
        } catch (error) {
            console.error(error)
            reject(false)
        }
    })
}

/**
 * 获取url上的search参数
*/
export function getQueryObj(url_){
    const url = url_ || window.location.href
    const search =url.slice(url.indexOf('?'))
    if(!search){
        return {}
    }
    const searchArr =search.slice(1,search.length).split('&')
    return searchArr.reduce((prev,next)=>{
        const [key,value] =next.split('=')
        prev[key]=value ;
        return prev
    },{})
}

/**
 * url的参数拼接
 * **/
 export function urlConcat(obj) {
    const {baseUrl,query} =obj||{}
    console.log(JSON.stringify(obj,null,2),'obj');
    return Object.keys(query).reduce((all,next,index)=>{
        if(index === 0){
            return all+=`?${next}=${query[next]}`
        }
        return all+=`&${next}=${query[next]}`
    },baseUrl)
}

/**
 * 设置query的方法
 * @url :是否传入URL进行拼接，默认本地href
 * @params{params:参数对象,isReplace：是否全量替换,isReload：是否更新页面，}
 * */
 export const setQueryObj = (url_,obj) => {
  const {params,isReplace} = obj || {};
  const href = url_ || window.location.href;
  const hrefSlice = href.indexOf('?') === -1 ? href : href.slice(0,href.indexOf('?')) ;
  let url =''
  // 是否全量替换字段
  if(isReplace) {
       url=urlConcat({baseUrl:hrefSlice,query:params})
  }else{
       url=urlConcat({baseUrl:hrefSlice,query:{...getQueryObj(url_),...params}})
  }
  return url
//   // 是否触发页面刷新
//   if(isReload){
//        window.location.href =url
//   }else{
//        window.history.pushState({}, '', url); // 只改变url不进行页面刷新
//   }
  
};
