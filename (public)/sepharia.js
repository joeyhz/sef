var qSpace = document.getElementById('questionMenu')

var philM = document.getElementById('philM')//.child('topMenu')//.child('philM')
var issM = document.getElementById('issuesM')
var morM = document.getElementById('moralM')
var lawM = document.getElementById('lawM')

var topMenu = [philM,issM,morM,lawM]

var activeM = 0;
var activeQ = 0;

var pqRef =firebase.database().ref('PhilQs/')
var iqRef =firebase.database().ref('IssQs/')
var mqRef =firebase.database().ref('MorQs/')
var lqRef =firebase.database().ref('LawQs/')

var refQList = [pqRef,iqRef,mqRef,lqRef]

var paRef =firebase.database().ref('PhilAs/')
var iaRef =firebase.database().ref('IssAs/')
var maRef =firebase.database().ref('MorAs/')
var laRef =firebase.database().ref('LawAs/')

var refAList = [paRef,iaRef,maRef,laRef]

var philList = [];
var issList = [];
var morList = [];
var lawList = [];

var masterQlist = [philList,issList,morList,lawList]
var masterKeyList = [[],[],[],[]]
var actQList = masterQlist[activeM]
var actKeyList = masterKeyList[activeM]

const qColor = "#3f595c";
const selQColor = "#618c91";

refQList.forEach(function(item,i){
    item.once('value', function(snapshot){
        masterQlist[i] = []
        snapshot.forEach(function(childSnapshot) {
            masterQlist[i].push(childSnapshot.val());
            masterKeyList[i].push(childSnapshot.key);
            console.log('q:key',childSnapshot.val()+':'+childSnapshot.key);
        })
    updateQs()
    changeAnswers(activeQ)
    document.getElementById('questionMenu').firstChild.style.backgroundColor = qColor;
    document.getElementById('questionMenu').firstChild.style.color = "white";
    })

})

topMenu.forEach(function(item,i){
    $(item).hover(function(){
        if (activeM != i){
            item.style.backgroundColor = "#abc4c7"
        }
    },
    function(){
        if (activeM == i){
            //alert(activeM + i)
            item.style.backgroundColor = selQColor;
        }else{
            item.style.backgroundColor = "LightGray";
        }
    });
    /*item.onmouseout = function(){
        item.style.backgroundColor = selQColor;
    }*/
    item.onclick = function(){
        changeActiveM(i)
        changeActiveQ(0)
    }
})

function updateQs(){
    actQList = masterQlist[activeM]
    actKeyList = masterKeyList[activeM]
    var qBlock = ""
    actQList.forEach(function(item,i){
        let stItem = item.replace(/\s+/g, '')
        //console.log(item,stItem);
        qBlock += "<div id = "+stItem+">"+item+"</div>"
    })
    qSpace.innerHTML = qBlock;
    checkQclicks(actQList)
}

function checkQclicks(l){
    l.forEach(function(item,i){
        //console.log(item)
        let stripItem = item.replace(/\s+/g, '')
        let wanted = document.getElementById(stripItem)
        wanted.onclick = function(){changeActiveQ(i)}
    })
}

function changeActiveM(selector){
    //console.log("Selector:",selector)
    activeM = selector;
    activeQ = 0;
    topMenu.forEach(function(item,i){
        if (i == activeM){
            item.style.backgroundColor = selQColor;
        }else{
            item.style.backgroundColor = "LightGray"
        }
    })
    document.getElementById("addQ").innerText = "New "+topMenu[selector].innerText+" Question"
    updateQs()
}

function changeActiveQ(ind){
    let strip = actQList[activeQ].replace(/\s+/g, '')
    document.getElementById(strip).style.color = "black";
    document.getElementById(strip).style.backgroundColor = selQColor;
    let strip2 = actQList[ind].replace(/\s+/g, '')
    console.log('strip2',strip2)
    document.getElementById(strip2).style.backgroundColor = qColor;
    document.getElementById(strip2).style.color = "white";
    document.getElementById('qSelected').innerText = document.getElementById(strip2).innerText;
    activeQ = ind;
    changeAnswers(activeQ)
}

function changeAnswers(qIndex){
    let qKey = masterKeyList[activeM][qIndex]
    refAList[activeM].child(qKey).once('value',function(snapshot){
        //console.log('key',snapshot.key)
        let totInfo = ''
        snapshot.forEach(function(a){
            let aInfo = '<div class = aBox>'
            let cit, des, ansRef
            a.forEach(function(inf){
                //console.log('type',inf.key);
                if (inf.key == 'ansRef'){
                    ansRef = inf.val()
                    aInfo += '<div class = ansRef><b>'+ansRef+'</b></div>'
                    //console.log('cit: ',cit);
                }else if(inf.key == 'cit'){
                    cit = inf.val()
                    aInfo += '<div class = infoBox>'+cit+'</div>'
                    //console.log('des: ',des);
                }else{
                    des = inf.val()
                    aInfo += '<b>Explanation</b><div class = infoBox>'+des+'</div></div>'
                }
            });
            totInfo += aInfo;
        })
        //console.log('total',totInfo);
        document.getElementById('belowButton').innerHTML = totInfo
    })
}

function filt() {
  // Declare variables
  var input, filter, txtValue;
  input = document.getElementById('myInput');
  filter = input.value.toUpperCase();
  actQList.forEach(function(item,i){
      let txt = item.toUpperCase();
      if (txt.indexOf(filter)> -1){
          let id = item.replace(/\s+/g, '')
          document.getElementById(id).style.display = ""
      }else{
          let id = item.replace(/\s+/g, '')
          document.getElementById(id).style.display = "none"
      }
  })
}

var qButton = document.getElementById('addQ');
var qInput = document.getElementById('qAdder')

qButton.onclick = function(){
    qButton.style.display = "none";
    qInput.style.display = "block";
    qInput.focus();
    qInput.addEventListener("keyup", function(event) {
      // Number 13 is the "Enter" key on the keyboard
      if (event.keyCode === 13) {
        // Cancel the default action, if needed
            event.preventDefault();
            if (qInput.value != ''){
                let key = refQList[activeM].push(qInput.value).key;
                console.log('key',key);
                masterKeyList[activeM].push(key);
                masterQlist[activeM].push(qInput.value)
                updateQs()
                changeAnswers(activeQ)
                qInput.value = '';
                qButton.style.display = "block";
                qInput.style.display = "none";
                changeActiveQ(masterQlist[activeM].length - 1)
            }
       }else if (event.keyCode === 27) {//escape
           event.preventDefault();
           qButton.style.display = "block";
           qInput.style.display = "none";
           qInput.value = '';
       }
    })
}

var quoteArea = document.getElementById('quoteArea');
var quoteSpace = document.getElementById('quoteSpace');

/*var titles = [];
$.get("https://www.sefaria.org/api/index/",
    function(data, status){
        if (status == 'success') {
            console.log(data);
            c1 = []
            data.forEach(function(item,i){
                c1.push(item.contents);
            });
            findTitles(c1)
            autoC()
        }
    }
)


function autoC(){
    $('#text').autocomplete({
        source:titles
    });
}

function findTitles(clist){
    if (clist.length == 0){return;}
    m = [];
    c = [];
    t = [];
    clist.forEach(function(item,i){
        console.log(typeof(item))
        item.forEach(function(it,j){m.push(it)})
    })
    m.forEach(function(item,i){
        if (item.contents){
            c.push(item.contents);
        }else{
            t.push(item.title)
        }
    })
    titles += t;
    console.log(titles);
    findTitles(c)
}
*/

/*            let c1list = [];
            let c2list = [];
            let c3list = [];
            let merge1list = [];
            let merge2list = [];
            let titles = [];
            data.forEach(function(item,i){
                c1list.push(item.contents);
            });
            console.log(c1list);
            c1list.forEach(function(item,i){
                item.forEach(function(it,j){merge1list.push(it)});
            });
            console.log(merge1list);
            merge1list.forEach(function(item,i){
                if (item.contents){
                    c2list.push(item.contents);
                }else{
                    titles.push(item.title)
                }
            });
            console.log(c2list);
            c2list.forEach(function(item,i){
                item.forEach(function(it,j){merge2list.push(it)});
            });

            console.log(merge2list);
            merge2list.forEach(function(item,i){
                if (item.contents){
                    c3list.push(item.contents);
                }else{
                    titles.push(item.title)
                }
            });
            console.log(c3list)
            console.log('titles',titles);
            */



document.getElementById('jax').onclick = function(){
    if ($('#text').val() != ''){
        findSource();
    }
}

function findSource(){
    var srcTxt = document.getElementById('text').value;
    srcTxt = srcTxt.trim().toLowerCase().replace(/\w\S*/g, (w) => (w.replace(/^\w/, (c) => c.toUpperCase())));//capitalize
    srcTxt = srcTxt.replace(/ /g, "_")//replace spaces with underscores
    srcTxt += '.'+document.getElementById('sub').value.trim()
    srcTxt += '.'+ document.getElementById('subSub').value.trim()
    //console.log('text',srcTxt)
    getQuote(srcTxt)
}

function getQuote(citation){
    let url = "https://www.sefaria.org/api/texts/"+citation+"?context=0";
    $.get(url,function(data,status){
        if (status == 'success' && data.text) {
            // What do when the request is successful
            quoteSpace.style.display = 'block';
            quoteArea.value = '';
            let quote = data.text
            //console.log('quote', quote)
            //console.log('type', typeof(quote))
            if (typeof(quote)== 'object'){
                //alert('true')
                quote.forEach(function(item, i){
                    line = removeHTMLandFootnotes(item);
                    console.log('line',line)
                    if (i > 1){
                        quoteArea.value +=' '+line;
                    }else{
                        quoteArea.value += line;
                    }
                });
            }else{
                console.log("quote",quote)
                console.log("q", removeHTMLandFootnotes(quote))
                quoteArea.value += removeHTMLandFootnotes(quote);
            }

            quoteArea.addEventListener("keydown", function(event) {
                event.preventDefault();
                if (event.keyCode === 8 || event.keyCode === 46){
                    let start = quoteArea.selectionStart;
                    let end = quoteArea.selectionEnd;
                    //console.log(start,end);
                    if (start != end){
                        let full = quoteArea.value;
                        let left = full.slice(0,start);
                        let right = full.slice(end);
                        quoteArea.value = left+' . . . '+right;
                    }
                }
            });

        }else if (status != 'success'){
            // What do when the request fails
            console.log('The request failed!',status);
            swal('Something went wrong','Try again later','error')
        }
        else{
            swal("That citation isn't valid",'Check your spelling against the titles at Sefaria.org','error')
        }
    })
}

/**Removes anything enclosed by <..> plus all footnotes. Returns altered line */
function removeHTMLandFootnotes(line){
    //Remove footnotes
    footInd = line.indexOf('<i class="footnote">')
    while (footInd !=-1){
        closeInd = line.indexOf("</i>", footInd)
        line = line.slice(0,footInd) + line.slice(closeInd+4)
        footInd = line.indexOf('<i class="footnote">',footInd)
    }

    //Remove superscripts and subscripts
    supInd = line.indexOf('<sup>')
    while (supInd !=-1){
        closeInd = line.indexOf("</sup>",supInd)
        line = line.slice(0,supInd) + line.slice(closeInd+6)
        supInd = line.indexOf('<sup>',supInd)
    }
    subInd = line.indexOf('<sub>')
    while (subInd !=-1){
        closeInd = line.indexOf("</sub>",subInd)
        line = line.slice(0,subInd) + line.slice(closeInd+6)
        subInd = line.indexOf('<sub>', subInd)
    }

    //remove remaining html tags
    openInd= line.indexOf('<');
    while (openInd != -1){
        closeInd = line.indexOf(">", openInd);
        line = line.slice(0,openInd)+line.slice(closeInd+1);
        openInd= line.indexOf('<', openInd);
    }
    return line
}

$('#text').keydown(function(event){
    if (event.which == 13||event.which == 9){
        event.preventDefault();
        $('#sub').focus();
    }
})

$('#sub').keydown(function(event){
    if (event.which == 13||event.which == 9){
        event.preventDefault();
        $('#subSub').focus();
    }
})
$('#subSub').keydown(function(event){
    if (event.which == 13){
        event.preventDefault();
        $('#jax').click();

    }
})

$('#addA').click(function(){
    //console.log('click');
    $('.newABox').show();
    $('#addA').hide();
    $('#text').focus()
})

$('.exit').click(function(){
    $('.newABox').hide();
    $('#addA').show();
    $('#text').val('')
    $('#sub').val('')
    $('#subSub').val('')
    $('#quoteArea').val('')
    $('#descInput').val('')
})

$('.done').click(function(){
    let currentKey = masterKeyList[activeM][activeQ]
    let currentRef = refAList[activeM].child(currentKey)
    let reference = $('#text').val().trim().toLowerCase().replace(/\w\S*/g, (w) => (w.replace(/^\w/, (c) => c.toUpperCase()))) +' '+$('#sub').val()+':'+$('#subSub').val()
    currentRef.push({
        ansRef:reference,
        cit:$('#quoteArea').val(),
        des:$('#desc').val()
    })
    $('#text').val('');
    $('#sub').val('');
    $('#subSub').val('');
    $('#quoteArea').val('');
    $('#desc').val('');
    $('.newABox').hide();
    $('#addA').show();
    changeAnswers(activeQ)
})

/*function getSelectionText() {
    //https://stackoverflow.com/questions/5379120/get-the-highlighted-selected-text
    var text = "";
    var activeEl = document.activeElement;
    var activeElTagName = activeEl ? activeEl.tagName.toLowerCase() : null;
    if (
      (activeElTagName == "textarea") || (activeElTagName == "input" &&
      /^(?:text|search|password|tel|url)$/i.test(activeEl.type)) &&
      (typeof activeEl.selectionStart == "number")
    ) {
        text = activeEl.value.slice(activeEl.selectionStart, activeEl.selectionEnd);
    } else if (window.getSelection) {
        text = window.getSelection().toString();
    }
    return text;
}*/
