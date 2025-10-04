(* Chart Generation using Wolfram Language *)

(* Generate Nutrition Pie Chart *)
GenerateNutritionPieChart[macros_Association] := 
  Module[{chart},
    chart = PieChart[
      {macros["protein"] * 4, macros["carbs"] * 4, macros["fats"] * 9},
      ChartLabels -> {"Protein", "Carbohydrates", "Fats"},
      ChartStyle -> {Blue, Green, Orange},
      PlotLabel -> "Daily Macronutrient Distribution (Calories)",
      ImageSize -> 400
    ];
    
    chart
  ]

(* Generate Progress Line Chart *)
GenerateProgressChart[data_List, metric_String] := 
  Module[{dates, values, chart},
    dates = data[[All, 1]];
    values = data[[All, 2]];
    
    chart = DateListPlot[
      Transpose[{dates, values}],
      PlotStyle -> Blue,
      PlotMarkers -> Automatic,
      PlotLabel -> "Progress Over Time: " <> metric,
      AxesLabel -> {"Date", metric},
      ImageSize -> 500
    ];
    
    chart
  ]

(* Generate BMI Chart *)
GenerateBMIChart[weight_List, height_?NumericQ] := 
  Module[{bmiValues, chart},
    bmiValues = weight / (height/100)^2;
    
    chart = ListLinePlot[
      bmiValues,
      PlotStyle -> Red,
      PlotMarkers -> Automatic,
      PlotLabel -> "BMI Over Time",
      AxesLabel -> {"Measurement", "BMI"},
      GridLines -> {{}, {18.5, 25, 30}},
      GridLinesStyle -> Directive[Gray, Dashed],
      ImageSize -> 500
    ];
    
    chart
  ]

(* Generate Calorie Distribution Chart *)
GenerateCalorieDistributionChart[meals_Association] := 
  Module[{calories, chart},
    calories = {
      meals["breakfast"],
      meals["lunch"],
      meals["dinner"],
      meals["snacks"]
    };
    
    chart = BarChart[
      calories,
      ChartLabels -> {"Breakfast", "Lunch", "Dinner", "Snacks"},
      ChartStyle -> {Yellow, Orange, Red, Green},
      PlotLabel -> "Daily Calorie Distribution",
      AxesLabel -> {"Meal", "Calories"},
      ImageSize -> 500
    ];
    
    chart
  ]

(* Generate Water Intake Chart *)
GenerateWaterIntakeChart[waterData_List] := 
  Module[{chart},
    chart = DateListPlot[
      waterData,
      PlotStyle -> Blue,
      Filling -> Axis,
      PlotLabel -> "Daily Water Intake",
      AxesLabel -> {"Date", "Water (Liters)"},
      ImageSize -> 500
    ];
    
    chart
  ]

(* Generate Exercise Chart *)
GenerateExerciseChart[exerciseData_List] := 
  Module[{chart},
    chart = DateListPlot[
      exerciseData,
      PlotStyle -> Green,
      PlotMarkers -> Automatic,
      PlotLabel -> "Exercise Duration Over Time",
      AxesLabel -> {"Date", "Duration (Minutes)"},
      ImageSize -> 500
    ];
    
    chart
  ]

(* Generate Comprehensive Dashboard *)
GenerateDashboard[healthData_Association] := 
  Module[{dashboard, charts = {}},
    (* Nutrition pie chart *)
    If[KeyExistsQ[healthData, "macros"],
      AppendTo[charts, GenerateNutritionPieChart[healthData["macros"]]]
    ];
    
    (* Progress chart *)
    If[KeyExistsQ[healthData, "progress"],
      AppendTo[charts, GenerateProgressChart[healthData["progress"], "Weight"]]
    ];
    
    (* BMI chart *)
    If[KeyExistsQ[healthData, "weightHistory"],
      AppendTo[charts, GenerateBMIChart[healthData["weightHistory"], healthData["height"]]]
    ];
    
    (* Calorie distribution *)
    If[KeyExistsQ[healthData, "mealCalories"],
      AppendTo[charts, GenerateCalorieDistributionChart[healthData["mealCalories"]]]
    ];
    
    (* Combine charts *)
    dashboard = GraphicsGrid[
      Partition[charts, 2],
      ImageSize -> 1000,
      Spacings -> 0.1
    ];
    
    dashboard
  ]

(* Export Chart as Image *)
ExportChart[chart_, filename_String, format_String:"PNG"] := 
  Export[filename <> "." <> ToLowerCase[format], chart, format]

(* Generate Chart Data for Frontend *)
GenerateChartData[chartType_String, data_Association] := 
  Module[{chartData = <||>},
    Switch[chartType,
      "nutrition-pie",
      chartData = <|
        "type" -> "pie",
        "data" -> {
          <|"label" -> "Protein", "value" -> data["protein"] * 4, "color" -> "blue"|>,
          <|"label" -> "Carbs", "value" -> data["carbs"] * 4, "color" -> "green"|>,
          <|"label" -> "Fats", "value" -> data["fats"] * 9, "color" -> "orange"|>
        }
      |>,
      
      "progress-line",
      chartData = <|
        "type" -> "line",
        "data" -> data["points"],
        "xLabel" -> "Date",
        "yLabel" -> data["metric"]
      |>,
      
      "calorie-bar",
      chartData = <|
        "type" -> "bar",
        "data" -> {
          <|"label" -> "Breakfast", "value" -> data["breakfast"]|>,
          <|"label" -> "Lunch", "value" -> data["lunch"]|>,
          <|"label" -> "Dinner", "value" -> data["dinner"]|>,
          <|"label" -> "Snacks", "value" -> data["snacks"]|>
        }
      |>
    ];
    
    chartData
  ]

(* Export functions *)
Export["chart-generation.wl", {
  "GenerateNutritionPieChart" -> GenerateNutritionPieChart,
  "GenerateProgressChart" -> GenerateProgressChart,
  "GenerateBMIChart" -> GenerateBMIChart,
  "GenerateCalorieDistributionChart" -> GenerateCalorieDistributionChart,
  "GenerateWaterIntakeChart" -> GenerateWaterIntakeChart,
  "GenerateExerciseChart" -> GenerateExerciseChart,
  "GenerateDashboard" -> GenerateDashboard,
  "ExportChart" -> ExportChart,
  "GenerateChartData" -> GenerateChartData
}]
