(* Health Insights using Wolfram Language *)

(* Analyze Health Risk Factors *)
AnalyzeHealthRisks[bmi_?NumericQ, age_?NumericQ, activityLevel_String] := 
  Module[{risks = {}},
    (* BMI-related risks *)
    If[bmi < 18.5, AppendTo[risks, "Underweight - increased risk of nutritional deficiencies"]];
    If[bmi >= 25 && bmi < 30, AppendTo[risks, "Overweight - increased risk of cardiovascular disease"]];
    If[bmi >= 30, AppendTo[risks, "Obese - high risk of multiple health complications"]];
    
    (* Age-related risks *)
    If[age > 40, AppendTo[risks, "Increased risk of age-related metabolic changes"]];
    If[age > 65, AppendTo[risks, "Higher risk of sarcopenia and bone density loss"]];
    
    (* Activity-related risks *)
    If[activityLevel == "sedentary", AppendTo[risks, "Sedentary lifestyle increases risk of chronic diseases"]];
    
    risks
  ]

(* Generate Health Insights *)
GenerateHealthInsights[healthData_Association] := 
  Module[{insights = {}, bmi, age, activityLevel, weight, height},
    bmi = healthData["bmi"];
    age = healthData["age"];
    activityLevel = healthData["activityLevel"];
    weight = healthData["weight"];
    height = healthData["height"];
    
    (* BMI insights *)
    If[bmi < 18.5,
      AppendTo[insights, "Consider increasing calorie intake with nutrient-dense foods"],
      If[bmi >= 25,
        AppendTo[insights, "Focus on creating a sustainable calorie deficit through diet and exercise"],
        AppendTo[insights, "Maintain your current healthy weight with balanced nutrition"]
      ]
    ];
    
    (* Activity insights *)
    Switch[activityLevel,
      "sedentary", AppendTo[insights, "Gradually increase physical activity to improve overall health"],
      "light", AppendTo[insights, "Consider adding moderate-intensity exercises to your routine"],
      "moderate", AppendTo[insights, "Maintain your current activity level for optimal health"],
      "active", AppendTo[insights, "Ensure adequate nutrition to support your active lifestyle"],
      "very-active", AppendTo[insights, "Focus on recovery nutrition and adequate hydration"]
    ];
    
    (* Age-specific insights *)
    If[age < 30, AppendTo[insights, "Establish healthy eating habits early for long-term health"]];
    If[age >= 30 && age < 50, AppendTo[insights, "Focus on maintaining muscle mass and bone density"]];
    If[age >= 50, AppendTo[insights, "Prioritize nutrient-dense foods and consider supplementation"]];
    
    insights
  ]

(* Calculate Health Score *)
CalculateHealthScore[healthData_Association] := 
  Module[{score = 100, bmi, age, activityLevel},
    bmi = healthData["bmi"];
    age = healthData["age"];
    activityLevel = healthData["activityLevel"];
    
    (* BMI scoring *)
    If[bmi < 18.5 || bmi >= 30, score -= 20];
    If[bmi >= 25 && bmi < 30, score -= 10];
    
    (* Age scoring *)
    If[age > 60, score -= 5];
    
    (* Activity scoring *)
    Switch[activityLevel,
      "sedentary", score -= 15,
      "light", score -= 5,
      "moderate", score += 5,
      "active", score += 10,
      "very-active", score += 15
    ];
    
    Max[score, 0]
  ]

(* Get Improvement Suggestions *)
GetImprovementSuggestions[healthData_Association] := 
  Module[{suggestions = {}, bmi, activityLevel, goal},
    bmi = healthData["bmi"];
    activityLevel = healthData["activityLevel"];
    goal = healthData["healthGoals"];
    
    (* General suggestions *)
    AppendTo[suggestions, "Track your food intake for better awareness"];
    AppendTo[suggestions, "Plan meals in advance to avoid unhealthy choices"];
    AppendTo[suggestions, "Stay consistent with your eating schedule"];
    
    (* Goal-specific suggestions *)
    Switch[goal,
      "weight-loss", {
        AppendTo[suggestions, "Create a moderate calorie deficit of 300-500 calories"];
        AppendTo[suggestions, "Focus on whole, unprocessed foods"];
        AppendTo[suggestions, "Include regular physical activity"]
      },
      "weight-gain", {
        AppendTo[suggestions, "Increase calorie intake with nutrient-dense foods"];
        AppendTo[suggestions, "Add healthy fats and protein to meals"];
        AppendTo[suggestions, "Consider resistance training to build muscle"]
      },
      "muscle-gain", {
        AppendTo[suggestions, "Ensure adequate protein intake (1.6-2.2g per kg body weight)"];
        AppendTo[suggestions, "Time protein intake around workouts"];
        AppendTo[suggestions, "Focus on progressive resistance training"]
      },
      "general-health", {
        AppendTo[suggestions, "Maintain a balanced diet with variety"];
        AppendTo[suggestions, "Stay physically active"];
        AppendTo[suggestions, "Get adequate sleep and manage stress"]
      }
    ];
    
    suggestions
  ]

(* Export functions *)
Export["health-insights.wl", {
  "AnalyzeHealthRisks" -> AnalyzeHealthRisks,
  "GenerateHealthInsights" -> GenerateHealthInsights,
  "CalculateHealthScore" -> CalculateHealthScore,
  "GetImprovementSuggestions" -> GetImprovementSuggestions
}]
