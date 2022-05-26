//------------------------------------------------------------------------------
//--- save recipe --------------------------------------------------------------
//------------------------------------------------------------------------------

function saveRecipe() {
    var text = '<?xml version="1.0" encoding="UTF-8"?> \n' +
    '<!DOCTYPE stylesheet SYSTEM "file:///C:/Users/nlutt/Documents/Websites/kochbuch/tools/entities.dtd">\n' +
    '<fr:recipe \n' +
    '    xmlns:fr="http://fruschtique.de/ns/recipe" \n' +
    '    xmlns:ht="http://www.w3.org/1999/xhtml" \n' +
    '    xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" \n' +
    '    xsi:schemaLocation= \n' +
    '    "http://fruschtique.de/ns/recipe ../../tools/recipe.xsd \n' +
    '    http://www.w3.org/1999/xhtml ../../tools/xhtml.xsd"> \n' +
    '</fr:recipe>';
    var parser = new DOMParser();
    var xmlDoc = parser.parseFromString(text, "text/xml");
    
    var recipeName = document.getElementsByName("recipeName")[0].value;
    var chapter = document.getElementById("chapter").value;
    var rcpName = xmlDoc.createElement("fr:recipeName");
    var rcpNameText = xmlDoc.createTextNode(recipeName);
    rcpName.appendChild(rcpNameText);
    xmlDoc.documentElement.appendChild(rcpName);
    
    var rcpInput = document.getElementsByName("recipeKeywords")[0].value;
    var rcpKeywords = xmlDoc.createElement("fr:recipeKeywords");
    var rcpKeywordsText = xmlDoc.createTextNode(rcpInput);
    rcpKeywords.appendChild(rcpKeywordsText);
    xmlDoc.documentElement.appendChild(rcpKeywords);
    
    var rcpIntro = xmlDoc.createElement("fr:recipeIntro");
    xmlDoc.documentElement.appendChild(rcpIntro);
    var introText = document.getElementsByName("introText");
    for (var i = 0; i < introText.length; i++) {
        var rcpintrotxtText = xmlDoc.createTextNode(introText[i].value);
        if (rcpintrotxtText.textContent.length > 0) {
            var rcpintrotxt = xmlDoc.createElement("fr:introText");
            rcpintrotxt.appendChild(rcpintrotxtText);
            xmlDoc.getElementsByTagName("fr:recipeIntro")[0].appendChild(rcpintrotxt);
        }
    }
    
    //--- ingredients ---------------------------------------------------
    var rcpIngredients = xmlDoc.createElement("fr:recipeIngredients");
    xmlDoc.documentElement.appendChild(rcpIngredients);
    var ingredientLists = document.getElementsByName("ingredientList");
    var rcpigdtlistnames = document.getElementsByName("ingdtListName");
    for (i = 0; i < ingredientLists.length; i++) {
        var curIgdtList = ingredientLists[i];
        var curIgdtListName = rcpigdtlistnames[i];
        
        var curIgdtNameList = $(curIgdtList).find('[name="ingdtName"]');
        var curIgdtQtyList = $(curIgdtList).find('[name="ingdtQuantity"]');
        var curIgdtRefList = $(curIgdtList).find('[name="ingdtRef"]');
        
        list_empty = true;
        for (var j = 0; j < curIgdtNameList.length; j++) {
            var txtName = xmlDoc.createTextNode(curIgdtNameList[j].value);
            if (txtName.textContent.length > 0) {
                list_empty = false;
            }
        }
        
        if (list_empty == false) {
            var txt = document.createTextNode(curIgdtListName.value);
            var rcpIgdtList = xmlDoc.createElement("fr:igdtList");
            var rcpIgdtListName = xmlDoc.createElement("fr:igdtListName");
            rcpIgdtListName.appendChild(txt);
            rcpIgdtList.appendChild(rcpIgdtListName);
            rcpIngredients.appendChild(rcpIgdtList);
            
            for (var j = 0; j < curIgdtNameList.length; j++) {
                var txtName = xmlDoc.createTextNode(curIgdtNameList[j].value);
                if (txtName.textContent.length > 0) {
                    list_empty = false;
                    var rcpigdtname = xmlDoc.createElement("fr:igdtName");
                    var rcpigdtqty = xmlDoc.createElement("fr:igdtQuantity");
                    var txtQty = xmlDoc.createTextNode(curIgdtQtyList[j].value);
                    var rcpigdtlistline = xmlDoc.createElement("fr:igdtListLine");
                    rcpigdtqty.appendChild(txtQty);
                    rcpigdtlistline.appendChild(rcpigdtqty);
                    rcpigdtname.appendChild(txtName);
                    rcpigdtname.setAttribute("ref", curIgdtRefList[j].value);
                    rcpigdtlistline.appendChild(rcpigdtname);
                    rcpIgdtList.appendChild(rcpigdtlistline);
                }
            }
        }
    }
    
    //--- instructions ---------------------------------------------------
    var rcpInstructions = xmlDoc.createElement("fr:recipeInstructions");
    xmlDoc.documentElement.appendChild(rcpInstructions);
    var stepList = document.getElementsByName("step");
    var stepNameList = document.getElementsByName("instrStepName");
    for (i = 0; i < stepList.length; i++) {
        instr_empty = true;
        var curStep = stepList[i];
        var StepTexts = $(curStep).find('[name="instrStepText"]');
        
        for (j = 0; j < StepTexts.length; j++) {
            txt = xmlDoc.createTextNode(StepTexts[j].value);
            if (txt.textContent.length > 0) {
                instr_empty = false;
            }
        }
        
        if (instr_empty == false) {
            var step = xmlDoc.createElement("fr:instruction");
            var stepName = xmlDoc.createElement("fr:instrStepName");
            txt = xmlDoc.createTextNode(stepNameList[i].value);
            stepName.appendChild(txt);
            step.appendChild(stepName);
            
            for (j = 0; j < StepTexts.length; j++) {
                var instrStepText = xmlDoc.createElement("fr:instrStepText");
                txt = xmlDoc.createTextNode(StepTexts[j].value);
                if (txt.textContent.length > 0) {
                    instrStepText.appendChild(txt);
                    step.appendChild(instrStepText);
                }
            }
            rcpInstructions.appendChild(step);
        }
    }
    
    //--- sideDish ----------------------------------------------------------------
    rcpInput = document.getElementsByName("dazuText")[0].value;
    var rcpSideDish = xmlDoc.createElement("fr:recipeSideDish");
    txt = xmlDoc.createTextNode(rcpInput);
    rcpSideDish.appendChild(txt);
    xmlDoc.documentElement.appendChild(rcpSideDish);
    
    //--- origin ----------------------------------------------------------------
    rcpInput = document.getElementsByName("originText")[0].value;
    var rcpOrigin = xmlDoc.createElement("fr:recipeOrigin");
    txt = xmlDoc.createTextNode(rcpInput);
    rcpOrigin.appendChild(txt);
    xmlDoc.documentElement.appendChild(rcpOrigin);
    
    //--- seeAlso ----------------------------------------------------------------
    rcpInput = document.getElementsByName("auchText")[0].value;
    var rcpAuch = xmlDoc.createElement("fr:recipeSeeAlso");
    var rcpAuchText = xmlDoc.createTextNode(rcpInput);
    rcpAuch.appendChild(rcpAuchText);
    xmlDoc.documentElement.appendChild(rcpAuch);
    
    //--- license ----------------------------------------------------------------
    rcpInput = document.getElementsByName("lizenzText")[0].value;
    var rcpLicense = xmlDoc.createElement("fr:recipeLicense");
    var rcpLicenseText = xmlDoc.createTextNode(rcpInput);
    rcpLicense.appendChild(rcpLicenseText);
    xmlDoc.documentElement.appendChild(rcpLicense);
    
    //--- serialize input to XML --------------------------------------------------
    var xmlText = new XMLSerializer().serializeToString(xmlDoc);
    xmlText =
    xmlText.replace(/&lt;a/g, '<ht:a').replace(/&lt;\/a&gt;/g, '</ht:a>').replace(/&lt;i/g, '<ht:i').replace(/&lt;\/i&gt;/g, '</ht:i>').replace(/&gt;/g, '>').replace(/&amp;/g,'&amp;');
    var blob = new Blob([xmlText], {
        type: "application/xml;charset=utf-8"
    });
    var zip = new JSZip();
    zip.folder(chapter).file(recipeName + '.xml', xmlText);
    zip.generateAsync({
        type: "blob"
    }).then(function (blob) {
        // Force down of the Zip file
        saveAs(blob, recipeName + ".zip");
    });
}

//------------------------------------------------------------------------------
//--- save cat assignments -----------------------------------------------------
//------------------------------------------------------------------------------

function saveCatAssignments() {
    var text = '<?xml version="1.0" encoding="UTF-8"?> \n' +
    '<!DOCTYPE stylesheet SYSTEM "file:///C:/Users/nlutt/Documents/Websites/kochbuch/tools/entities.dtd">\n' +
    '<cat:assignments \n' +
    '    xmlns:fr="http://fruschtique.de/ns/recipe" \n' +
    '    xmlns:cat="http://fruschtique.de/ns/recipe-cat" \n' +
    '    xmlns:ht="http://www.w3.org/1999/xhtml" \n' +
    '    xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" \n' +
    '    xsi:schemaLocation= \n' +
    '    "http://fruschtique.de/ns/recipe-cat ../categories/cat-assign.xsd \n' +
    '    http://www.w3.org/1999/xhtml ../tools/xhtml.xsd"> \n' +
    '</cat:assignments>';
    var parser = new DOMParser();
    var xmlDoc = parser.parseFromString(text, "text/xml");
    
    var cats =[
    "für Gäste",
    "für jeden Tag",
    "für's Büffet",
    "für's Frühstück",
    "zum Sekt",
    "klein, aber fein",
    "Quiches",
    "orientalisch u asiatisch",
    "italienisch",
    "deutsch",
    "meine Lieblinge"];
    
    var cols =[
    "587291",
    "587291",
    "587291",
    "587291",
    "fe621d",
    "fe621d",
    "419d78",
    "565554",
    "565554",
    "565554",
    "a71d31"];
    
    var v = $('#vers').val();
    xmlDoc.getElementsByTagName("cat:assignments")[0].setAttribute("version", v);
    
    var Recipes = document.getElementsByClassName('rcpName');
    var countRecipes = Recipes.length;
    
    //--- looping over categories ---
    for (var i = 0; i < 11; i++) {
        var assign = xmlDoc.createElement("cat:assignment");
        var catg = xmlDoc.createElement("cat:cat");
        var curCat = cats[i];
        var catgTxt = xmlDoc.createTextNode(curCat);
        catg.appendChild(catgTxt);
        assign.appendChild(catg);
        
        //--- looping over recipes ---
        var rcpPerCat = document.getElementsByName(curCat);
        var collect = '';
        for (var j = 0; j < countRecipes; j++) {
            if (rcpPerCat[j].checked) {
                collect = collect + ',' + rcpPerCat[j].value;
            }
        }
        collect = collect.substr(1);
        
        var rcp = xmlDoc.createElement("cat:recipes");
        var rcpTxt = xmlDoc.createTextNode(collect);
        rcp.appendChild(rcpTxt);
        assign.appendChild(rcp);
        
        var col = xmlDoc.createElement("cat:color");
        var curCol = cols[i];
        var colTxt = xmlDoc.createTextNode(curCol);
        col.appendChild(colTxt);
        assign.appendChild(col);
        
        xmlDoc.documentElement.appendChild(assign);
    }
    
    //--- serialize input to XML --------------------------------------------------
    var xmlText = new XMLSerializer().serializeToString(xmlDoc);
    xmlText =
    xmlText.replace(/&lt;a/g, '<ht:a').replace(/&lt;\/a&gt;/g, '</ht:a>').replace(/&lt;i/g, '<ht:i').replace(/&lt;\/i&gt;/g, '</ht:i>').replace(/&gt;/g, '>').replace(/&amp;/g,'&amp;');
    var blob = new Blob([xmlText], {
        type: "application/xml;charset=utf-8"
    });
    saveAs(blob, "recipe2cat assignment " + v + ".xml");
}