var randomKeywords  = ["人工智能"," 人类","会意","传感器","克隆","具备","内核","出现","前往","匹配","医疗","即将","却","历史","反","可以","哪里","器官","回来","图","地球","场景","复杂","大多","大脑","失望","好在","妥协","媲美","完全","完整","实现","富有","对","将","局部","已经","干脆","幻想","幻片","广泛","应用于","度过","开头","彻底","很久","忘掉","忘记了","怀有","意识","意识到","愿","慢了","成为","成功","我们","或者","或许","战争","技术","拥有","改变","政治","故事","效率","旅行","星","星际","景","暴乱","有","期待","未来","机上","机器人","来","来自","格局","模式","死去","比邻","没能","派出","测试","浑浑噩噩","灵","现在","甚至","生灵","用","由于","的","目睹","直觉","相爱","看上去","着","研制","祖先","神经","科","科学","突发","算法","组成","结构","继续","置换","老化","而是","联合政府","能在","腐败","自己","自恋","行业","解决","计算","计算机","记得","识到","谁也","起义","超级","转移","迅速","过","过去","过程中","这个","进展","通过"];




/* use Slice  obecjt */

var sliceGen = require('../echidna-data/slice.js');
// var moment = require('moment');

/*

newSlice(numberItems, streamLength, init)

    Generate one slice
    
    - numberItems   : Integer   how many keywords fo you want

*/

exports.newSlice = function (numberItems){
  // var slice = [];

  // generateSlice(numberItems, init, function(data) {
  //   slice = data;
  // })

    
    var slice = new sliceGen.Slice()
    
    for (var i = 0; i < numberItems; i++) {

      // var word = randomKeywords.randomElement();
      var word = randomKeywords[i];
      var count = Math.round(20*Math.random());
      var source = 'http://weibo.com/ID';
      var panel = 5;
      
      slice.addValue(word, count, source, panel);
    
    };

    return slice;
}


/*


   Private function to generate each slice
   
   RETURN A DATA STRUCTURE

    "keywords" : [
          {
              "keyword": "<KEYWORD>",
              "sliceid" : "<TIMESTAMP X>"
              "count" : "<X FOR TIME PERIOD>",
              "samplesrcid": "<POST ID FROM WEIBO>",
          },
          {
              // second keyword
          }
    ]
*/

function generateSlice(numberItems, init, callback) {
  
  // console.log(numberItems);
  // numberItems+1;
  // keyword = randomKeywords.randomElement();
    
  var slice =[];
    // console.log(j)
  for (var i = 0; i < numberItems ; i++) {

      if(init) var sliceid = Date.now()  - init*1000;
      else var sliceid = Date.now();

      // console.log(i,init, sliceid);
      var keyword = randomKeywords[i];

      
      // added random words poping in
      // setInterval(function(){
      //   keyword = randomKeywords.randomElement();
      // },3000);

      
      var kw = {
        keyword : keyword,
        samplesrcid : "blablabla",
        count : (i*5)*Math.random() +12.5,
        sliceid : sliceid // + Math.random()*2
      };
      
      slice.push(kw);

  };


  // console.log(slice);
  callback(slice);
  
}


Array.prototype.randomElement = function () {
    return this[Math.floor(Math.random() * this.length)]
}