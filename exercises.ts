export const ExercsieResponse = [
  {
    exercise: {
      title: "Push Ups",
      slug: "push-ups",
      difficulty: "beginner",
      duration: 300,
      equipment: [],
      targetMuscles: ["chest", "triceps"],
      muscleGroups: ["chest", "shoulders"],
    },
    contents: [
      {
        type: "text",
        content: "Start in a plank position with hands under shoulders...",
        position: 1,
        meta: { caption: "Form instructions", duration: 60 },
      },
      {
        type: "image",
        content: "https://example.com/push-up-image.jpg",
        position: 2,
        meta: { caption: "Correct posture" },
      },
    ],
  },
];
