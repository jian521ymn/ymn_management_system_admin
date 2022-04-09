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
export function getQueryObj(){
    const search =window.location.href.slice(window.location.href.indexOf('?'))
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