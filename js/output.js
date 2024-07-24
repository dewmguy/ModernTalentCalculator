var i = 0;
var htmlOutput = "";
var talentDescriptionArray = new Array;

htmlOutput += '<div class="header separate"><div class="characterclass"><img class="icon" src="img/'+pageId+'/icon.png" /> <span class="'+pageId+'">'+uiClassName+'</div><div>Required Level: <span id="levelRequired">'+ theRequiredLevel +'</span></div><div>Points Left: <span id="tabPointsAvailable">'+ rankPoints +'</span></div> <div><span title="Copy" class="link" data-class="'+pageId+'" data-code="" id="copyURL"><i class="fa-solid fa-link"></i></span> <i class="fa-solid fa-minus"></i> <span title="Save" class="link" data-class="'+pageId+'" data-code="" id="saveBuild"><i class="fa-solid fa-floppy-disk"></i></span> <i class="fa-solid fa-minus"></i> <span title="Reset" class="link" onClick="resetTreeAll()"><i class="fa-solid fa-trash-can"></i></span></div></div>';

htmlOutput += '<div class="trees">';

for(var printTreeID = 0; printTreeID < numberOfTrees; printTreeID++) {
 var treeID = tree[printTreeID];
 var treeName = nltree[printTreeID].replace(" ", "").toLowerCase();
 var maxPoints = getTreeTotalPoints(printTreeID);
 var treeNameUI = tree[printTreeID];
 
 htmlOutput += '<div class="tree">';
 htmlOutput += '<div class="header"><div><img class="icon" src="/warcraft/talents/img/'+pageId+'/'+(printTreeID+1)+'.png" /> <span class="treename">'+ treeNameUI +'</span></div><div><span id="'+tree[printTreeID]+'tabPoints">'+ pointsTree[printTreeID] +'</span> / '+maxPoints+'<span class="hide" id="'+tree[printTreeID]+'tabPointsText">'+ textPoints +'</span></span></div></div>';
 htmlOutput += '<div data-class="'+pageId+'" data-spec="'+treeName+'" class="talents '+pageId+'" id="'+ treeID +'Tree">';
 var vertical = tierNum;
 var verticalCounter;
 var horizontal = 4;
 var horizontalCounter;
 while(talent[i] && talent[i][0] == printTreeID && i != (talent.length - 1)) {
  htmlOutput += '<table>';
  for(verticalCounter = 1; verticalCounter <= vertical; verticalCounter++) {
   htmlOutput += "<tr>";
   for(horizontalCounter = 1; horizontalCounter <= horizontal; horizontalCounter++) {
    htmlOutput += '<td id="'+i+'" class="talent"><div class="container">';
    if(talent[i] && talent[i][3] == horizontalCounter && talent[i][4] == verticalCounter) {
     var imageName;
     talentName = talent[i][1];
     imageName = nltalent[i][0];
     imageName = imageName.replace(/[^a-zA-Z0-9]/g,'').toLowerCase();

     var talentLabelColor;
     htmlOutput += '<div class="talentRank">';

     if(rankTop[i][0] == talent[i][2]) { talentLabelColor = "yellow"; }
     else if(rankTop[i][0] > 0 ) { talentLabelColor = "green"; }
     else { talentLabelColor = "gray"; }

     htmlOutput += '<span id="modifyRankTopColor'+i+'" class="'+talentLabelColor+'"><span id="modifyRankTop'+i+'" class="'+talentLabelColor+'">'+rankTop[i][0] +'</span>/'+talent[i][2]+'</span>';
     htmlOutput += '</div>'; //talentRank closer
	 
     htmlOutput += '<img id="talentIcon'+i+'" onClick="rankTopOnClick('+i+');" onMouseOver="unhideTalent('+i+');" onMouseOut="hideTalent('+i+');" onContextMenu="rankTopOnRightClick('+i+'); return false;" class="'+talentLabelColor+'" src="img/'+nlclass+'/'+treeName+'/'+imageName+'.png">';

     htmlOutput += '<div class="mouseOverHide" id="talentMouseOver'+i+'">'; //talentmouseover container open

     tierTalent = talent[i][4];
	 rankTalent = (rankTop[i][0]<1) ? 1 : rankTop[i][0]; //minimum tooltip rank 1
     htmlOutput += '<div id="armoryOver'+i+'">'; //tooltip container open
	 htmlOutput += '<p><span class="talentTooltipRankStyle">Rank <span id="modifyRankTopDescription'+i+'">'+rankTalent+'</span><span class="hide">/'+talent[i][2]+'</span></span><span class="talentTooltipNameStyle">'+ talent[i][1] +'</span></p>';
     htmlOutput += '<div id="modifyDescriptionTop'+i+'"><p class="description">'+rankTop[i][1]+'</p></div>';
     //if the talent requires other talent
	 if(talent[i][5]) {
      requirement = talent[i][5][0];
	  requirementPoints = talent[i][5][1];
      requirementName = talent[requirement][1];
      htmlOutput += '<p id="requiresTalent'+i+'" class="red">'+requiresRequires+' '+ requirementPoints +' '+ requiresPointsIn+' '+requirementName +'</p>';
     }
     //if the talent requires more points in other tiers
     if(talent[i][4] != 1) { htmlOutput += '<p id="requiresPoints'+i+'" class="red">'+requiresRequires+' '+ ((talent[i][4]*5)-5) +' '+ requiresPointsIn+' '+tree[talent[i][0]] +' '+ requiresTalents +'</p>'; }
	 htmlOutput += '</div>'; //tooltip container close
	 htmlOutput += '</div>'; //talentmouseover container close

	 if(talent[i][5]) { // arrow handling
      thisTalentX = talent[i][3];
      thisTalentY = talent[i][4];
      requiredTalentX = talent[requirement][3];
      requiredTalentY = talent[requirement][4];

      var arrowColor = "";
	  var arrowClass = "";
	  var arrowImage = "";

      if(urltalents) {
       if(saveTemplate[i] == talent[i][2]) { arrowColor = "yellow"; }
       else if(saveTemplate[i] > 0) { arrowColor = "green"; }
      }

      if(thisTalentX == requiredTalentX) {
       if((thisTalentY - 1) == requiredTalentY) { arrowClass = 'arrowdown1'; arrowImage = 'down-1'; }
       else if((thisTalentY - 2) == requiredTalentY) { arrowClass = 'arrowdown2'; arrowImage = 'down-2'; }
       else if((thisTalentY - 3) == requiredTalentY) { arrowClass = 'arrowdown3'; arrowImage = 'down-3'; }
       else if((thisTalentY - 4) == requiredTalentY) { arrowClass = 'arrowdown4'; arrowImage = 'down-4'; }
      }
      else if(thisTalentY == requiredTalentY) {
       if(requiredTalentX == (thisTalentX - 1)) { arrowClass = 'arrowacrossright'; arrowImage = 'across-right'; }
       else if(requiredTalentX == (thisTalentX + 1)) { arrowClass = 'arrowacrossleft'; arrowImage = 'across-left'; }
      }
      else if(thisTalentX == (requiredTalentX-1)) {
       if((thisTalentY - 1) == requiredTalentY) { arrowClass = 'arrowdownleft'; arrowImage = 'down-left'; }
       else { arrowClass = 'arrowdown2left'; arrowImage = 'down-2-left'; }
      }
      else if((thisTalentX-1) == requiredTalentX) {
       if((thisTalentY - 1) == requiredTalentY) { arrowClass = 'arrowdownright'; arrowImage = 'down-right'; }
       else { arrowClass = 'arrowdown2right'; arrowImage = 'down-2-right'; }
      }
	  htmlOutput += '<div id="arrow'+i+'" class="arrow '+arrowClass+' '+arrowColor+'"><img src="/warcraft/talents/img/ui/'+arrowImage+'.png"></div>';
     } // end arrow handling
     i++;
    }
    else { htmlOutput += "&nbsp;"; } //empty contents
    htmlOutput += "</div></td>"; // talent contents closer
   }
   htmlOutput += "</tr>";
  }
  htmlOutput += '</table>'; //end of talent table
 } //end while
 htmlOutput += '</div>' //end of talents
 htmlOutput += '<div onclick="resetTree('+printTreeID+')" class="resetbutton"><i class="fa-solid fa-square-xmark"></i>Reset</div>';
 htmlOutput += '</div>' //end of tree
} //end for loop

htmlOutput += "</div>"; //end of trees

htmlOutput += '<div class="debug">';
htmlOutput += '<span class="red" id="modifyRankPoints">'+ eval(theRequiredLevel - 9) +'</span>';
for(var jia = 0; jia < tree.length; jia++) { htmlOutput += '<span id="'+ tree[jia] +'PointsTopRight">'+ pointsTree[jia] +'</span>'; }
htmlOutput += '<p id="debugcoderaw"></p>';
htmlOutput += '<p id="debugcode"></p>';
htmlOutput += '</div>';

document.getElementById('replaceMeWithTalents').innerHTML = htmlOutput;
canTurnGreen(0, 0, 1);
canTurnGreen(0, 1, 1);
canTurnGreen(0, 2, 1);
changeCopyURL();