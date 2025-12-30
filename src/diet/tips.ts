export interface DietTip {
    emoji: string;
    text: string;
}

export const DIET_TIPS: DietTip[] = [
    // --- HYDRATION & BASICS ---
    { emoji: '💧', text: 'Drink 500ml water immediately after waking up to activate your metabolism.' },
    { emoji: '🧂', text: 'Pinch of salt in water before workout gives better pumps.' },
    { emoji: '🥛', text: 'Thirst often masks as hunger. Drink water if you feel random cravings.' },
    { emoji: '☕', text: 'Black coffee is a natural fat burner. No sugar.' },
    { emoji: '🚫', text: 'Don\'t drink your calories (Coke/Juice). Eat them.' },

    // --- NEPALI NUTRITION ---
    { emoji: '🍛', text: 'Dal Bhat Power 24 Hour? Only if you double the Dal and half the Bhat.' },
    { emoji: '🧱', text: 'Satu is the Nepali superfood. High protein, good carbs. Don\'t underestimate it.' },
    { emoji: '🌾', text: 'Chiura expands in your stomach. Drink water with it to avoid bloating.' },
    { emoji: '🥟', text: 'Momos are love, but 1 plate = 600-800 calories. Treat it as a cheat meal.' },
    { emoji: '🥓', text: 'Sukuti is great protein, but watch the sodium (salt). Drink extra water.' },
    { emoji: '🧈', text: 'Ghee is healthy fat, but 1 spoon, not 1 cup.' },
    { emoji: '🥒', text: 'Gundruk is a probiotic bomb. Great for gut health.' },
    { emoji: '🥘', text: 'Khichdi is the ultimate recovery meal. Easy to digest.' },

    // --- PROTEIN & MUSCLE ---
    { emoji: '🥩', text: 'Protein intake needs to be consistent. Don\'t skip meals.' },
    { emoji: '🥚', text: 'Eggs are nature\'s multivitamin. Don\'t throw the yolk unless you have to.' },
    { emoji: '🥤', text: 'Whey protein is just filtered milk. It\'s not steroids.' },
    { emoji: '🍗', text: 'Boiled chicken boring? Air fry it with masala. Same macros, better taste.' },
    { emoji: '🌱', text: 'Vegetarian? Soya Chunks have more protein per gram than chicken.' },
    { emoji: '😴', text: 'Muscles grow while sleeping, not while lifting. Aim for 7-8 hours.' },
    { emoji: '🧪', text: 'Creatine Monohydrate: 5g every day. Yes, even on rest days.' },

    // --- GYM BRO WISDOM ---
    { emoji: '🏋️', text: 'Progressive overload: Lift heavier or do 1 more rep than last week.' },
    { emoji: '🛑', text: 'Ego lifting kills gains. Controlled eccentric (lowering) builds more muscle.' },
    { emoji: '🦵', text: 'Never skip leg day. Squats release more growth hormone than bicep curls.' },
    { emoji: '🦸', text: 'Consistency > Intensity. 5 average workouts beat 1 perfect workout.' },
    { emoji: '🏃', text: 'Cardio doesn\'t kill gains if you do it AFTER weights.' },
    { emoji: '🌡️', text: 'Warm up shoulders and knees properly. Injuries set you back months.' },
    { emoji: '🧘', text: 'Stress kills gains (cortisol). Take 5 mins to breathe after workout.' },
    { emoji: '🧱', text: 'You can\'t out-train a bad diet. Abs are revealed in the kitchen.' },

    // --- LIFESTYLE & HACKS ---
    { emoji: '🚶', text: 'Walk 10 mins after Dal Bhat to blunt the insulin spike.' },
    { emoji: '🥗', text: 'Eat fiber (salad) first, then protein, then carbs (rice/roti). fixes blood sugar.' },
    { emoji: '🍫', text: 'Dark chocolate (70%+) is a great pre-workout snack for blood flow.' },
    { emoji: '🥜', text: 'Nuts are healthy but calorie dense. Count them, don\'t grab a handful.' },
    { emoji: '🧠', text: 'Motivation gets you started. Habit keeps you going.' },
    { emoji: '📉', text: 'Weight loss is non-linear. Don\'t panic if scale goes up one day.' },
    { emoji: '🍺', text: 'Alcohol pauses fat burning for 24-48 hours. Choose wisely.' },
    { emoji: '🍬', text: 'Sugar makes you crave MORE sugar. Break the cycle.' },

    // --- HARD TRUTHS ---
    { emoji: '💀', text: 'If you are tired, sleep. If you are lazy, move.' },
    { emoji: '🤥', text: 'Cheating on your diet is cheating on yourself.' },
    { emoji: '📱', text: 'Stop scrolling between sets. Focus.' },
    { emoji: '🍽️', text: 'One bad meal won\'t make you fat. One good meal won\'t make you lean.' },
    { emoji: '🕰️', text: 'The best time to start was yesterday. The second best time is now.' },
    { emoji: '💪', text: 'Soreness isn\'t a sign of a good workout. Progress is.' },
    { emoji: '🚽', text: 'Hydration check: If your pee is yellow, drink more water.' },
    { emoji: '🍕', text: 'If you crave junk, eat a fruit first. If you\'re still hungry, eat the junk.' },
    { emoji: '🥶', text: 'Cold showers mimic a mini-workout for your nervous system.' },
    { emoji: '🌞', text: 'Get sunlight in the morning. Sets your circadian rhythm for better sleep.' },
    { emoji: '⚖️', text: 'Weigh yourself daily, but look at the weekly average.' },
    { emoji: '🤝', text: 'Find a gym bro. Accountability is the ultimate supplement.' },

    // --- NEW ADDITIONS (50+ TIPS) ---
    // --- ADVANCED NUTRITION ---
    { emoji: '🥩', text: 'Red meat isn\'t the enemy. It\'s packed with B12, Zinc, and Creatine.' },
    { emoji: '🐟', text: 'Omega-3s (Fish Oil) reduce inflammation. Less pain = better workouts.' },
    { emoji: '🍚', text: 'White rice vs Brown rice? The difference is negligible. Eat what you digest better.' },
    { emoji: '🥔', text: 'Potatoes are the most satiating carb source. Great for cutting.' },
    { emoji: '🥑', text: 'Don\'t fear fats. They regulate hormones (testosterone). Minimum 0.6g per kg.' },
    { emoji: '🍭', text: 'Artificial sweeteners (Coke Zero) are safe in moderation. Better than sugar spikes.' },
    { emoji: '🥬', text: 'Magnesium Glycinate before bed helps with deep sleep and muscle relaxation.' },
    { emoji: '💊', text: 'Multivitamins are insurance, not a meal replacement. Real food first.' },
    { emoji: '🧂', text: 'Electrolytes matter. If you feel dizzy standing up, drink salt water.' },
    { emoji: '🌶️', text: 'Spicy food boosts metabolism slightly, but don\'t burn your stomach lining.' },

    // --- GYM TACTICS ---
    { emoji: '🎧', text: 'The best pre-workout is a heartbreak or a good playlist. Or caffeine.' },
    { emoji: '🏋️', text: 'Compound lifts (Squat, Bench, Deadlift) give 80% of your results.' },
    { emoji: '🤏', text: 'Grip strength failing? Use straps. You\'re training back, not forearms.' },
    { emoji: '🍑', text: 'Glutes are the biggest muscle group. Training them boosts overall metabolism.' },
    { emoji: '🧱', text: 'Abs are made in the gym, revealed in the kitchen.' },
    { emoji: '🚶', text: 'Active recovery (walking) clears lactic acid faster than sitting on the couch.' },
    { emoji: '🤕', text: 'Pain is specific. Sharp pain = Stop. Dull ache = Keep going.' },
    { emoji: '📝', text: 'Log your workouts. You can\'t improve what you don\'t measure.' },
    { emoji: '🕰️', text: 'Time under tension > Rep count. Control the weight.' },
    { emoji: '🤸', text: 'Stretching is boring but necessary. Tight hips cause back pain.' },

    // --- MENTAL GAME ---
    { emoji: '🦁', text: 'You don\'t have to be motivated. You just have to be disciplined.' },
    { emoji: '🎯', text: 'Set a goal so big it scares you. Then break it down into daily steps.' },
    { emoji: '🕰️', text: 'Patience. You didn\'t get out of shape in a day, you won\'t get fit in a day.' },
    { emoji: '🤥', text: 'Don\'t compare your Chapter 1 to someone else\'s Chapter 20.' },
    { emoji: '📸', text: 'Take progress photos. The mirror lies, photos don\'t.' },
    { emoji: '🚫', text: 'Stop looking for the "perfect" plan. The best plan is the one you stick to.' },
    { emoji: '🥶', text: 'Do hard things. Cold showers, heavy sets, awkward conversations.' },
    { emoji: '📉', text: 'Plateaus are normal. It means your body has adapted. Change the stimulus.' },
    { emoji: '🥇', text: 'Your only competition is the person you were yesterday.' },
    { emoji: '🧘', text: 'Mental stress burns physical energy. Meditate to save gains.' },

    // --- NEPALI CONTEXT II ---
    { emoji: '🍗', text: 'Sekuwa is the ultimate high-protein street food. Skip the chiura.' },
    { emoji: '🥘', text: 'Thukpa is great for hydration and veggies, but add extra egg/meat.' },
    { emoji: '🥟', text: 'Buff Momo > Veg Momo for protein. But Fried Momo is a calorie bomb.' },
    { emoji: '🥛', text: 'Mohi (Buttermilk) is better than Coke. Probiotics + Hydration.' },
    { emoji: '🌽', text: 'Polleko Makai (Roasted Corn) is a healthy carb snack.' },
    { emoji: '🥜', text: 'Bhatmas Sadeko is protein-packed but calorie-dense. Watch portions.' },
    { emoji: '🍛', text: 'Tarkari is often cooked in too much oil. Ask mom to use less oil.' },
    { emoji: '🍵', text: 'Chiya (Tea) with milk and sugar adds up. Try Black Tea or reduce sugar.' },
    { emoji: '🥘', text: 'Kwati is a protein powerhouse. Eat it more than once a year.' },
    { emoji: '🏃', text: 'Kathmandu is dusty. Wear a mask if running outdoors.' },

    // --- SLEEP & RECOVERY ---
    { emoji: '📱', text: 'Blue light blocks melatonin. No screens 30 mins before bed.' },
    { emoji: '🌡️', text: 'Sleep in a cool room. 18-20°C is optimal for deep sleep.' },
    { emoji: '☕', text: 'Caffeine has a 6-hour half-life. No coffee after 2 PM.' },
    { emoji: '📖', text: 'Reading fiction before bed reduces stress by 68%.' },
    { emoji: '🌑', text: 'Darkness signals sleep. Get blackout curtains or an eye mask.' },
    { emoji: '🛌', text: 'Your bed is for sleep and sex only. Don\'t work in bed.' },
    { emoji: '🔄', text: 'Consistency. Wake up at the same time every day to fix your clock.' },
    { emoji: '🧘', text: 'NSDR (Non-Sleep Deep Rest) or Yoga Nidra can replace lost sleep.' },
    { emoji: '🧴', text: 'Magnesium spray on feet helps restless legs.' },
    { emoji: '👃', text: 'Mouth taping forces nose breathing. Better oxygenation, deeper sleep.' },

    // --- LIFE HACKS ---
    { emoji: '🛒', text: 'Never grocery shop when hungry. You will buy junk.' },
    { emoji: '🍱', text: 'Meal prep prevents bad decisions. Cook once, eat thrice.' },
    { emoji: '🥡', text: 'Ask for "source on side" at restaurants. Saves 200+ calories.' },
    { emoji: '🍽️', text: 'Use smaller plates. It tricks your brain into feeling fuller.' },
    { emoji: '🧹', text: 'Household chores burn calories. Clean your room, burn fat.' },
    { emoji: '🚲', text: 'Take the stairs. It\'s free cardio.' },
    { emoji: '🦷', text: 'Brush your teeth after dinner. Signals "eating window closed".' },
    { emoji: '📝', text: 'Write down what you eat. You\'d be surprised how much you snack.' },
    { emoji: '💧', text: 'Carry a water bottle everywhere. If it\'s there, you\'ll drink it.' },
    { emoji: '🍬', text: 'Chewing gum can curb cravings in a pinch.' }
];
