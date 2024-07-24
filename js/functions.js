const alphaNumeric = 'abcdefghijklmnopqrstuvwxyz0123456789ABCDEFGHIJKLMNOPQRST';

function changeLevelRequired() {
 document.getElementById('levelRequired').innerHTML = calculateRequiredLevel(rankPoints);
}

function getStringRequires(requirementPoints, requirementName) {
 var theS = "s";
 if(requirementPoints == 1) { theS = ""; }
 var theString = 'Requires '+ requirementPoints +' point'+ theS +' in '+ requirementName;
 return theString;
}

function getStringRequiresTalents(requirementPoints, requirementName) {
 var theString = 'Requires '+ requirementPoints +' points in '+ requirementName +' Talents';
 return theString
}

function resetTree(theTree) {
 if(pointsTree[theTree] == 0) { return; }
 maxTierArray[theTree] = 1;
 rankPoints += pointsTree[theTree];
 pointsTree[theTree] = 0;
 document.getElementById(tree[theTree]+'PointsTopRight').innerHTML = 0;
 for(var y = 0; y < tierNum; y++) { pointsTier[theTree][y] = 0; }
 var i;
 var iStop;
 if(theTree == 0) { i = 0; }
 else { i = treeStartStop[theTree-1] + 1; }
 iStop = treeStartStop[theTree];
 while (i <= iStop) {
  rankTop[i][0] = 0;
  rankTop[i][1] = rank[i][0];
  rankTop[i][2] = rank[i][1];
  $("#talentIcon"+i+", #modifyRankTopColor"+i+", #modifyRankTop"+i).removeClass().addClass("gray");
  document.getElementById('modifyDescriptionTop'+i).innerHTML = '<p class="description">'+rankTop[i][1]+'</p>';
  if(talent[i][5]) {
   $("#arrow"+i).removeClass("yellow").removeClass("green");
   $("#talentIcon"+i+", #modifyRankTopColor"+i+", #modifyRankTop"+i).removeClass().addClass("gray"); // talents with prereqs
  }
  document.getElementById('modifyRankTopDescription'+i).innerHTML = 0;
  document.getElementById('modifyRankTop'+i).innerHTML = 0;
  if(talent[i][4] == 1 && !talent[i][5]) {
   $("#talentIcon"+i+", #modifyRankTopColor"+i+", #modifyRankTop"+i).removeClass().addClass("green"); // initial talents on page load
  }
  i++;
 }
 changeLevelRequired();
 document.getElementById('modifyRankPoints').innerHTML = rankPointsMax - rankPoints;
 document.getElementById('tabPointsAvailable').innerHTML = rankPoints;
 document.getElementById(tree[theTree]+'tabPoints').innerHTML = 0;
 changeCopyURL();
}

function resetTreeAll() {
 for(var i = 0; i < tree.length; i++) { resetTree(i); }
}

function getTreeTotalPoints(theTree) {
 let sum = 0;
 const start = theTree === 0 ? 0 : treeStartStop[theTree - 1] + 1;
 const end = treeStartStop[theTree];
 for(let i = start; i <= end; i++) { sum += talent[i][2]; }
 return sum;
}

function getMaxTier(theTree) {
 var maxTier = 0;
 for(var loopMaxTier = 0; loopMaxTier < tierNum; loopMaxTier++) {
  if(pointsTier[theTree][loopMaxTier] != 0) { maxTier = loopMaxTier; }
 }
 maxTier++;
 return maxTier;
}

function getPointsAboveAndCurrent(theTree, maxTier) {
 var pointsTierTotalAboveAndCurrent = 0;
 var loopPointsTierAbove = 0;
 for(loopPointsTierAbove; loopPointsTierAbove < maxTier; loopPointsTierAbove++) {
  pointsTierTotalAboveAndCurrent += pointsTier[theTree][loopPointsTierAbove];
 }
 return pointsTierTotalAboveAndCurrent;
}
  
function canUnlearn(talentID, clickLeftRight, maxTier) {
 var treeID = talent[talentID][0];
 var maxRank = talent[talentID][2];
 var treePoints = pointsTree[treeID];
 var necessaryPoints;
 var projectedPoints;
 var pointsAboveAndCurrent;
 if(hasDependentTalentWithPoints(talentID)) { return false; }
 if(clickLeftRight == 0) { //left click
  var theCurrentRank = rankTop[talentID][0];
  if(theCurrentRank < maxRank) {
   necessaryPoints = (talent[talentID][4] - 1) * 5;
   if(treePoints < necessaryPoints) { return false; }
   if(rankPoints == 0) { return false; }
   if(!checkRequiredTalent(talentID) && theCurrentRank == 0) { return false; }
   projectedPoints = pointsAboveAndCurrent++;
  }
  else { return false; }
 }
 else { //right click
  if(rankTop[talentID][0] != 0) {
   pointsAboveAndCurrent = getPointsAboveAndCurrent(treeID, maxTier-1);
   projectedPoints = pointsAboveAndCurrent - 1 + pointsTier[treeID][maxTier-1];
   for(var thisTier = talent[talentID][4]; thisTier < maxTier; maxTier--) {
    necessaryPoints = (maxTier-1) *5;
    projectedPoints -= pointsTier[treeID][maxTier-1];
    if(projectedPoints < necessaryPoints) { return false; }
   }
  }
  else { return false; } //if the rank is 0
 } 
 return true;
}

function getTalentID(talentName) { //updated
 return talent.findIndex(t => t[1] === talentName);
}

const getMinLevel = talentID => ((talent[talentID][4] - 1) * 5 + 10); //updated

function hasDependentTalentWithPoints(talentID) { //updated
 var theTree = talent[talentID][0];
 var loopStart = (talentID !== 0) ? talentID - 1 : talentID;
 var loopStop = treeStartStop[theTree];
 for(var i = loopStart; i <= loopStop; i++) {
  if(talent[i][5] && talent[i][5][0] === talentID && rankTop[i][0] !== 0) { return true; }
 }
 return false;
}

function canTurnGreen(totalPoints, tree, oldMaxTier) {
 var i;
 var necessaryPoints;
 var iStop;
 var thisTier;
 if(tree == 0) { i = 0; }
 else { i = treeStartStop[tree-1] + 1; }
 iStop = treeStartStop[tree];
 while (i <= iStop) {
  thisTier = talent[i][4];
  necessaryPoints = (thisTier-1) * 5;
  if(thisTier <= oldMaxTier+3 || necessaryPoints <= totalPoints) {
   var noRequirement = checkRequiredTalent(i);
   var theCurrentRank = rankTop[i][0];
   var theMaxRank = talent[i][2];
   if((talent[i][4] * 5) <= totalPoints && theCurrentRank != theMaxRank && noRequirement || (theCurrentRank < theMaxRank && necessaryPoints <= totalPoints && noRequirement)) {
    $("#talentIcon"+i+", #modifyRankTopColor"+i+", #modifyRankTop"+i).removeClass().addClass("green");
    if(canUnlearn(i, 0, oldMaxTier) && talent[i][5]) { $("#arrow"+i).removeClass("yellow").addClass("green"); }
   }
   else if(theCurrentRank == theMaxRank) { $("#talentIcon"+i+", #modifyRankTopColor"+i+", #modifyRankTop"+i).removeClass().addClass("yellow"); }
   else if(theCurrentRank > 0 ) { $("#talentIcon"+i+", #modifyRankTopColor"+i+", #modifyRankTop"+i).removeClass().addClass("green"); }
   else {
	$("#talentIcon"+i+", #modifyRankTopColor"+i+", #modifyRankTop"+i).removeClass().addClass("gray");
    if(talent[i][5]) { $("#arrow"+i).removeClass("green").removeClass("yellow"); }
   }
  }
  i++;
 } 
 i=0;
 if(rankPoints == 0) {
  while(talent[i]) {
   if(rankTop[i][0] == 0) {
	$("#talentIcon"+i+", #modifyRankTopColor"+i+", #modifyRankTop"+i).removeClass().addClass("gray");
    if(talent[i][5]) { $("#arrow"+i).removeClass("green").removeClass("yellow"); }
   }
   else {
	$("#"+i+" .talentRank").show();
   }
   i++;
  } 
 }
}

function checkRequiredTalent(talentID) { //updated
 var reqTalent = talent[talentID][5];
 if(reqTalent) {
  var reqTalentID = reqTalent[0];
  var reqTalentPoints = reqTalent[1];
  return rankTop[reqTalentID][0] === reqTalentPoints;
 }
 return true;
}

function rankTopOnClick(talentID) {
 var theTree = talent[talentID][0];
 var oldMaxTier = maxTierArray[theTree];
 if(!canUnlearn(talentID, 0, oldMaxTier)) { return; }
 maxRank = talent[talentID][2]; //maximum rank possible 
 var theTier = talent[talentID][4];
 var theTierIndex = theTier - 1;
 var rankString = rankTop[talentID][1];
 var theCurrentRank = rankTop[talentID][0];
 if(theCurrentRank < maxRank) { //see if you hit max rank
  rankTop[talentID][1] = rank[talentID][theCurrentRank];
  rankTop[talentID][0]++; //if you haven't hit max rank, increment
  theUpdatedRank = rankTop[talentID][0];
  rankTop[talentID][2] = rank[talentID][theUpdatedRank];
  rankPoints--;
  if(theUpdatedRank != maxRank) { rankString = '<p class="description">'+rankTop[talentID][1]+'<p>Next Rank:</p><p class="description">'+rankTop[talentID][2]+'</p>'; }
  else { rankString = '<p class="description">'+rankTop[talentID][1]+'</p>'; }
  if(talent[talentID][5]) {
   $("#arrow"+talentID).removeClass("green").addClass("yellow");
  }
  pointsTree[theTree]++; //keep track of points in the tier
  pointsTier[theTree][theTierIndex] = pointsTier[theTree][theTierIndex] + 1;
 }
 if(theUpdatedRank == 1 && theTier > oldMaxTier) { maxTierArray[theTree] = theTier; }
 if(pointsTree[theTree] == 1) { document.getElementById(tree[theTree]+'tabPointsText').innerHTML = textPoint; } //pluralizer
 else { document.getElementById(tree[theTree]+'tabPointsText').innerHTML = textPoints; }
 document.getElementById('modifyDescriptionTop'+talentID).innerHTML = rankString;
 document.getElementById('modifyRankTop'+talentID).innerHTML = rankTop[talentID][0];
 document.getElementById('modifyRankTopDescription'+talentID).innerHTML = rankTop[talentID][0];
 document.getElementById('modifyRankPoints').innerHTML = rankPointsMax - rankPoints;
 changeLevelRequired();
 document.getElementById(tree[theTree]+'PointsTopRight').innerHTML = pointsTree[theTree];
 document.getElementById('tabPointsAvailable').innerHTML = rankPoints;
 document.getElementById(tree[theTree]+'tabPoints').innerHTML = pointsTree[theTree];
 canTurnGreen(pointsTree[theTree], theTree, oldMaxTier);
 changeCopyURL();
}

function rankTopOnRightClick(talentID) {
 var theTree = talent[talentID][0];
 var oldMaxTier = maxTierArray[theTree];
 if(!canUnlearn(talentID, 1, oldMaxTier)) { return; }
 var maxRank = talent[talentID][2];     //maximum rank possible
 var theTier = talent[talentID][4];
 var theTierIndex = theTier - 1;
 var rankString = rankTop[talentID][1];
 if(rankTop[talentID][0] > 0) {
  rankTop[talentID][0]--;
  if(rankTop[talentID][0]-1 != -1) {
   rankTop[talentID][1] = rank[talentID][(rankTop[talentID][0]-1)];
   rankTop[talentID][2] = rank[talentID][(rankTop[talentID][0])];
   rankString = '<p class="description">'+rankTop[talentID][1]+'</p><p>Next Rank:</p><p class="description">'+ rankTop[talentID][2]+'</p>';
  }
  else {
   rankTop[talentID][1] = rank[talentID][rankTop[talentID][0]];
   rankString = '<p class="description">'+rankTop[talentID][1]+'</p>';
  }
  rankPoints++;
  pointsTree[theTree]--;
  pointsTier[theTree][theTierIndex]--;
  if(rankTop[talentID][0] == 0) {
   if(talent[talentID][5]) {
    //when final point is removed from talent with pre-req
   }
   oldMaxTier = getMaxTier(theTree);
   maxTierArray[theTree] = oldMaxTier;
  }
  if(rankPoints == 1) {
   canTurnGreen(pointsTree[0], 0, maxTierArray[0]);
   canTurnGreen(pointsTree[1], 1, maxTierArray[1]);
   canTurnGreen(pointsTree[2], 2, maxTierArray[2]);
  }
 }

 if(pointsTree[theTree] == 1) { document.getElementById(tree[theTree]+'tabPointsText').innerHTML = textPoint; }
 else { document.getElementById(tree[theTree]+'tabPointsText').innerHTML = textPoints; }
 document.getElementById('modifyDescriptionTop'+talentID).innerHTML = rankString;
 document.getElementById('modifyRankTop'+talentID).innerHTML = rankTop[talentID][0];
 let rankTalent = (rankTop[talentID][0] < 1) ? 1 : rankTop[talentID][0];
 document.getElementById('modifyRankTopDescription'+talentID).innerHTML = rankTalent;
 document.getElementById('modifyRankPoints').innerHTML = rankPointsMax - rankPoints;
 changeLevelRequired();
 document.getElementById(tree[theTree]+'PointsTopRight').innerHTML = pointsTree[theTree];
 document.getElementById(tree[theTree]+'tabPoints').innerHTML = pointsTree[theTree];
 document.getElementById('tabPointsAvailable').innerHTML = rankPoints;
 if(rankPoints != 1) { canTurnGreen(pointsTree[theTree], theTree, oldMaxTier); }
 changeCopyURL();
}

function compress(str) {
 let compressed = '';
 if(str.length % 2 !== 0) { str += '0'; }
 for (let i = 0; i < str.length; i += 2) {
  const chunk = str.substring(i, i + 2);
  const num = parseInt(chunk, 10);
  if (num < 0 || num >= 100) { compressed += 'Z'; }
  else if (num < alphaNumeric.length) { compressed += alphaNumeric[num]; }
  else { compressed += (num - 60).toString(); }
 }
 return compressed;
}

function decompress(str) {
 let decompressed = '';
 for(const char of str) {
  const index = alphaNumeric.indexOf(char);
  if (index !== -1) { decompressed += index.toString().padStart(2, '0'); }
  else {
   const num = parseInt(char, 10);
   if (num >= 0 && num <= 39) { decompressed += (num + 60).toString().padStart(2, '0'); }
   else { decompressed += '00'; }
  }
 }
 return decompressed;
}

function changeCopyURL() { //updated
 var templateString = talent.map(function(t, i) { return rankTop[i][0]; }).join('');
 $('#saveBuild,#copyURL').attr('data-code', compress(templateString));
 $('#debugcode').html(templateString);
 $('#debugcoderaw').html(compress(templateString));
}

function unhideTalent(input) { //updated
 $("#talentMouseOver" + input).show();
}

function hideTalent(input) { //updated
 $("#talentMouseOver" + input).hide();
}