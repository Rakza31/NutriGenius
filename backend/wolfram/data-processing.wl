(* Data Processing using Wolfram Language *)

(* Process Health Assessment Data *)
ProcessHealthData[rawData_Association] := 
  Module[{processedData = <||>, bmi, bmr, tdee},
    (* Calculate basic metrics *)
    bmi = rawData["weight"] / (rawData["height"]/100)^2;
    bmr = CalculateBMR[rawData["weight"], rawData["height"], rawData["age"], rawData["gender"]];
    tdee = CalculateTDEE[bmr, rawData["activityLevel"]];
    
    (* Store processed data *)
    processedData["bmi"] = Round[bmi, 0.1];
    processedData["bmr"] = Round[bmr];
    processedData["tdee"] = Round[tdee];
    processedData["bmiCategory"] = GetBMICategory[bmi];
    
    (* Calculate macronutrients *)
    processedData["macros"] = CalculateMacros[tdee, rawData["healthGoals"], rawData["weight"]];
    
    (* Generate insights *)
    processedData["insights"] = GenerateHealthInsights[rawData];
    processedData["risks"] = AnalyzeHealthRisks[bmi, rawData["age"], rawData["activityLevel"]];
    processedData["score"] = CalculateHealthScore[rawData];
    
    processedData
  ]

(* Get BMI Category *)
GetBMICategory[bmi_?NumericQ] := 
  Switch[True,
    bmi < 18.5, "Underweight",
    bmi < 25, "Normal weight",
    bmi < 30, "Overweight",
    True, "Obese"
  ]

(* Process Nutrition Data *)
ProcessNutritionData[foodData_List] := 
  Module[{processedData = <||>, totalCalories = 0, totalProtein = 0, totalCarbs = 0, totalFats = 0},
    (* Sum up nutrition values *)
    Do[
      totalCalories += food["calories"];
      totalProtein += food["protein"];
      totalCarbs += food["carbs"];
      totalFats += food["fats"];
    , {food, foodData}];
    
    processedData["totalCalories"] = totalCalories;
    processedData["totalProtein"] = totalProtein;
    processedData["totalCarbs"] = totalCarbs;
    processedData["totalFats"] = totalFats;
    
    (* Calculate percentages *)
    processedData["proteinPercent"] = (totalProtein * 4) / totalCalories * 100;
    processedData["carbsPercent"] = (totalCarbs * 4) / totalCalories * 100;
    processedData["fatsPercent"] = (totalFats * 9) / totalCalories * 100;
    
    processedData
  ]

(* Process Progress Data *)
ProcessProgressData[historyData_List] := 
  Module[{processedData = <||>, dates, weights, bmis, trends},
    (* Extract data *)
    dates = historyData[[All, "date"]];
    weights = historyData[[All, "weight"]];
    bmis = historyData[[All, "bmi"]];
    
    (* Calculate trends *)
    trends = CalculateTrends[weights];
    
    processedData["dates"] = dates;
    processedData["weights"] = weights;
    processedData["bmis"] = bmis;
    processedData["weightTrend"] = trends["weight"];
    processedData["bmiTrend"] = trends["bmi"];
    processedData["progressRate"] = trends["rate"];
    
    processedData
  ]

(* Calculate Trends *)
CalculateTrends[data_List] := 
  Module[{trend, rate, n = Length[data]},
    If[n < 2, Return[<|"trend" -> "insufficient data", "rate" -> 0|>]];
    
    (* Simple linear trend *)
    trend = If[data[[-1]] > data[[1]], "increasing", 
      If[data[[-1]] < data[[1]], "decreasing", "stable"]];
    
    rate = (data[[-1]] - data[[1]]) / (n - 1);
    
    <|"trend" -> trend, "rate" -> rate|>
  ]

(* Validate Health Data *)
ValidateHealthData[data_Association] := 
  Module[{errors = {}, warnings = {}},
    (* Required fields *)
    If[!KeyExistsQ[data, "age"], AppendTo[errors, "Age is required"]];
    If[!KeyExistsQ[data, "gender"], AppendTo[errors, "Gender is required"]];
    If[!KeyExistsQ[data, "height"], AppendTo[errors, "Height is required"]];
    If[!KeyExistsQ[data, "weight"], AppendTo[errors, "Weight is required"]];
    
    (* Range validations *)
    If[KeyExistsQ[data, "age"] && (data["age"] < 1 || data["age"] > 120),
      AppendTo[errors, "Age must be between 1 and 120"]];
    
    If[KeyExistsQ[data, "height"] && (data["height"] < 50 || data["height"] > 300),
      AppendTo[errors, "Height must be between 50 and 300 cm"]];
    
    If[KeyExistsQ[data, "weight"] && (data["weight"] < 10 || data["weight"] > 500),
      AppendTo[errors, "Weight must be between 10 and 500 kg"]];
    
    (* Warnings *)
    If[KeyExistsQ[data, "bmi"] && data["bmi"] > 30,
      AppendTo[warnings, "BMI indicates obesity - consult healthcare provider"]];
    
    If[KeyExistsQ[data, "age"] && data["age"] > 65,
      AppendTo[warnings, "Consider consulting healthcare provider for age-specific recommendations"]];
    
    <|"valid" -> (Length[errors] == 0), "errors" -> errors, "warnings" -> warnings|>
  ]

(* Clean and Normalize Data *)
CleanData[rawData_Association] := 
  Module[{cleanedData = <||>},
    (* Copy valid keys *)
    Do[
      If[KeyExistsQ[rawData, key] && rawData[key] =!= Null && rawData[key] =!= "",
        cleanedData[key] = rawData[key]
      ]
    , {key, Keys[rawData]}];
    
    (* Normalize strings *)
    If[KeyExistsQ[cleanedData, "gender"],
      cleanedData["gender"] = ToLowerCase[cleanedData["gender"]]
    ];
    
    If[KeyExistsQ[cleanedData, "activityLevel"],
      cleanedData["activityLevel"] = ToLowerCase[cleanedData["activityLevel"]]
    ];
    
    If[KeyExistsQ[cleanedData, "healthGoals"],
      cleanedData["healthGoals"] = ToLowerCase[cleanedData["healthGoals"]]
    ];
    
    (* Ensure numeric values *)
    If[KeyExistsQ[cleanedData, "age"],
      cleanedData["age"] = Round[cleanedData["age"]]
    ];
    
    If[KeyExistsQ[cleanedData, "height"],
      cleanedData["height"] = Round[cleanedData["height"], 0.1]
    ];
    
    If[KeyExistsQ[cleanedData, "weight"],
      cleanedData["weight"] = Round[cleanedData["weight"], 0.1]
    ];
    
    cleanedData
  ]

(* Aggregate Data for Analytics *)
AggregateData[dataList_List, timeFrame_String] := 
  Module[{aggregated = <||>, filteredData},
    (* Filter data by timeframe *)
    filteredData = FilterDataByTimeframe[dataList, timeFrame];
    
    (* Calculate averages *)
    aggregated["avgWeight"] = Mean[filteredData[[All, "weight"]]];
    aggregated["avgBMI"] = Mean[filteredData[[All, "bmi"]]];
    aggregated["avgCalories"] = Mean[filteredData[[All, "calories"]]];
    
    (* Calculate trends *)
    aggregated["weightTrend"] = CalculateTrends[filteredData[[All, "weight"]]];
    aggregated["bmiTrend"] = CalculateTrends[filteredData[[All, "bmi"]]];
    
    (* Count assessments *)
    aggregated["totalAssessments"] = Length[filteredData];
    
    aggregated
  ]

(* Filter Data by Timeframe *)
FilterDataByTimeframe[data_List, timeframe_String] := 
  Module[{cutoffDate, filtered},
    cutoffDate = Switch[timeframe,
      "1week", DatePlus[Today, -7],
      "1month", DatePlus[Today, -30],
      "3months", DatePlus[Today, -90],
      "6months", DatePlus[Today, -180],
      "1year", DatePlus[Today, -365],
      "all", DateObject[{1900, 1, 1}]
    ];
    
    filtered = Select[data, #["date"] >= cutoffDate &];
    filtered
  ]

(* Export functions *)
Export["data-processing.wl", {
  "ProcessHealthData" -> ProcessHealthData,
  "ProcessNutritionData" -> ProcessNutritionData,
  "ProcessProgressData" -> ProcessProgressData,
  "ValidateHealthData" -> ValidateHealthData,
  "CleanData" -> CleanData,
  "AggregateData" -> AggregateData,
  "GetBMICategory" -> GetBMICategory,
  "CalculateTrends" -> CalculateTrends
}]
