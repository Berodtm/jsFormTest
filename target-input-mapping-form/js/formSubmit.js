// Define the LeadSubmission class
class LeadSubmission {
  constructor(aemId, leadId, objective, asmLocations, audienceRefinementId) {
    this.aemId = aemId;
    this.leadId = leadId;
    this.objective = objective;
    this.type = this.determineType(aemId);
    this.placement = this.determinePlacement(aemId);
    this.testType = this.determineTestType(leadId);
    this.mappingLocation = this.determineMappingLocation(aemId, asmLocations);
    this.priority = this.determinePriority(leadId);
    this.tokenised = this.determineTokenised(aemId);
    this.rated = this.determineRated(aemId);
    this.measuredBy = this.determineMeasuredBy(leadId);
    this.audienceRefinement = audienceRefinementId;
  }

  determineType(aemId) {
    if (aemId.includes("/dkp/")) {
      return "Desktop";
    } else if (aemId.includes("/app/")) {
      return "App";
    } else if (aemId.includes("/mbr/")) {
      return "Mobile Browser";
    } else {
      return "device type Unknown";
    }
  }

  determinePlacement(aemId) {
    if (aemId.includes("/lnk/")) {
      return "lnk";
    } else if (aemId.includes("/asm/")) {
      return "asm";
    } else if (aemId.includes("/bpt/")) {
      return "bpt";
    } else if (aemId.includes("/til/")) {
      return "til";
    } else if (aemId.includes("/eal/")) {
      return "eal";
    } else if (aemId.includes("/fea/")) {
      return "fea";
    } else if (aemId.includes("/nvt/")) {
      return "nvt";
    } else if (aemId.includes("/phl/")) {
      return "phl";
    } else if (aemId.includes("/lob/")) {
      return "lob";
    } else {
      return "Placement Unknown";
    }
  }
  determineTestType(leadId) {
    if (leadId.includes("_ab_")) {
      return "AB";
    } else {
      return "XT";
    }
  }
  determineMappingLocation(aemId, asmLocations) {
    if (aemId.includes("/asm/") && asmLocations.length > 0) {
      return "MBOX: " + asmLocations.join(", ");
    } else if (aemId.includes("/bpt/")) {
      return "bpt ref";
    } else {
      return "ref Unknown";
    }
  }
  determinePriority(leadId) {
    if (leadId.includes("_ab_")) {
      return "1";
    } else {
      return "0";
    }
  }
  determineTokenised(aemId) {
    if (aemId.includes("/ty/")) {
      return "Yes - Tokenised";
    } else {
      return "No - Non-tokenised";
    }
  }
  determineRated(aemId) {
    if (aemId.includes("/ry/")) {
      return "Yes: Rated";
    } else {
      return "No: No rates";
    }
  }
  determineMeasuredBy(leadId) {
    if (leadId.includes("rotational")) {
      return "Additional Metrics";
    } else {
      return "Page views and engagement";
    }
  }
  determineAudienceRefinement(leadId) {
    // Assuming the audience refinement suffix is already appended to the leadId
    let baseId = leadId.split("_")[0];
    let refinementSuffix = leadId.substring(baseId.length); // Get the part after the baseId
    return baseId + refinementSuffix;
  }
}

let TargetMappingInstancesArray = [];

const addLeadSubmission = (e) => {
  e.preventDefault();

  let aemIdValue = document.getElementById("aem-id").value.toLowerCase();
  let leadIdValue = document.getElementById("lead-id").value.toLowerCase();
  let objective = document.getElementById("objective-id").value.toLowerCase();

  if (!aemIdValue || !leadIdValue || !objective) {
    alert("Fill in the form");
    return;
  }

  let asmLocations = [];
  if (document.getElementById("location1").checked)
    asmLocations.push("Account Overview | ASM | ASM1");
  if (document.getElementById("location2").checked)
    asmLocations.push("Account Overview | ASM | ASM2");
  if (document.getElementById("location3").checked)
    asmLocations.push("Account Overview | ASM | ASM3");

  // Create a LeadSubmission instance for each ASM location
  asmLocations.forEach((location, index) => {
    let audienceRefinementId = leadIdValue.split("_")[0] + "_p" + (index + 1); // Unique ID for audience refinement
    let newLeadSubmission = new LeadSubmission(
      aemIdValue,
      leadIdValue,
      objective,
      [location], // Pass only the current location
      audienceRefinementId // Pass the unique audience refinement ID
    );
    TargetMappingInstancesArray.push(newLeadSubmission);
  });

  document.querySelector("#form-container form").reset();
  console.warn("Added", { TargetMappingInstancesArray });
  let pre = document.querySelector("#form-output pre");
  pre.textContent = "\n" + JSON.stringify(TargetMappingInstancesArray, "\t", 2);

  const asmOptions = document.getElementById("asm-options");
  asmOptions.style.display = "none";
};

document.getElementById("submit").addEventListener("click", addLeadSubmission);

//event listeners

document.getElementById("submit").addEventListener("click", addLeadSubmission);

document.getElementById("aem-id").addEventListener("input", function (e) {
  const asmOptions = document.getElementById("asm-options");
  if (e.target.value.includes("/asm/")) {
    asmOptions.style.display = "block";
  } else {
    asmOptions.style.display = "none";
  }
});

// For display
// let displayContent = '';
// TargetMappingInstancesArray.forEach((submission) => {
//     displayContent += '{\n';
//     for (let key in submission) {
//         let displayKey = keys(key); // Get the display key name
//         displayContent += `  "${displayKey}": "${submission[key]}",\n`; // Use the display key name
//     }
//     displayContent += '}\n';
// });

// let pre = document.querySelector('#form-output pre');
// pre.textContent = '\n' + displayContent;

// const keys = (key) => {
//   const keyMap = {
//     aemId: "AEM ID",
//     leadId: "Lead ID",
//     // more mappings...
//   };
//   return keyMap[key] || key;
// };
// let objectKey = 'aemId';
// let displayKey = formatKey(objectKey); // Converts to 'AEM ID'
