(* Nutrition Calculations using Wolfram Language *)

(* Calculate BMI *)
CalculateBMI[weight_?NumericQ, height_?NumericQ] := 
  weight / (height/100)^2

(* Calculate BMR using Mifflin-St Jeor Equation *)
CalculateBMR[weight_?NumericQ, height_?NumericQ, age_?NumericQ, gender_String] := 
  Module[{bmr},
    bmr = 10 * weight + 6.25 * height - 5 * age;
    If[gender == "male", bmr + 5, bmr - 161]
  ]

(* Calculate TDEE *)
CalculateTDEE[bmr_?NumericQ, activityLevel_String] := 
  Module[{multiplier},
    multiplier = Switch[activityLevel,
      "sedentary", 1.2,
      "light", 1.375,
      "moderate", 1.55,
      "active", 1.725,
      "very-active", 1.9,
      _, 1.2
    ];
    bmr * multiplier
  ]

(* Calculate Macronutrient Distribution *)
CalculateMacros[calories_?NumericQ, goal_String, weight_?NumericQ] := 
  Module[{protein, fats, carbs, proteinCal, fatCal, carbCal},
    (* Protein: 1g per lb of body weight *)
    protein = weight * 2.2;
    proteinCal = protein * 4;
    
    (* Fats: 25% of total calories *)
    fatCal = calories * 0.25;
    fats = fatCal / 9;
    
    (* Carbs: remaining calories *)
    carbCal = calories - proteinCal - fatCal;
    carbs = carbCal / 4;
    
    <|"protein" -> protein, "carbs" -> carbs, "fats" -> fats|>
  ]

(* Get Nutrition Recommendations *)
GetNutritionRecommendations[age_?NumericQ, gender_String, goal_String] := 
  Module[{recommendations},
    recommendations = {
      "Maintain a balanced diet with variety",
      "Stay hydrated with adequate water intake",
      "Include fiber-rich foods in your diet",
      "Limit processed foods and added sugars"
    };
    
    If[age > 50, AppendTo[recommendations, "Consider calcium and vitamin D supplements"]];
    If[gender == "female", AppendTo[recommendations, "Ensure adequate iron intake"]];
    
    Switch[goal,
      "weight-loss", AppendTo[recommendations, "Create a moderate calorie deficit"],
      "weight-gain", AppendTo[recommendations, "Increase calorie intake with nutrient-dense foods"],
      "muscle-gain", AppendTo[recommendations, "Focus on protein intake and resistance training"],
      "general-health", AppendTo[recommendations, "Maintain consistent eating patterns"]
    ];
    
    recommendations
  ]

(* Export functions for use in Node.js *)
Export["nutrition-calculations.wl", {
  "CalculateBMI" -> CalculateBMI,
  "CalculateBMR" -> CalculateBMR,
  "CalculateTDEE" -> CalculateTDEE,
  "CalculateMacros" -> CalculateMacros,
  "GetNutritionRecommendations" -> GetNutritionRecommendations
}]
