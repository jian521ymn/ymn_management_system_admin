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