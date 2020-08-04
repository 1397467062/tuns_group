module.exports={
    "GET /api/mockdata": (req, res) => {
        console.log(req)
        console.log(res)
        res.send({
            msg:"登录成功"
        })
    }

}