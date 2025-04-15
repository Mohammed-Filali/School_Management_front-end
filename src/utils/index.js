export const formatDate = (date) => {
  // Get the month, day, and year
  const month = date.toLocaleString("en-US", { month: "short" });
  const day = date.getDate();
  const year = date.getFullYear();

  const formattedDate = `${day}-${month}-${year}`;

  return formattedDate;
};

export function dateFormatter(dateString) {
  const inputDate = new Date(dateString);

  if (isNaN(inputDate)) {
    return "Invalid Date";
  }

  const year = inputDate.getFullYear();
  const month = String(inputDate.getMonth() + 1).padStart(2, "0");
  const day = String(inputDate.getDate()).padStart(2, "0");

  const formattedDate = `${year}-${month}-${day}`;
  return formattedDate;
}

export function getInitials(fullName) {
   const names = fullName.split(" ");

  const initials = names.slice(0, 2).map((name) => name[0].toUpperCase());

  const initialsStr = initials.join("");

  return initialsStr;
}
export function getGradeColor(grade) {
  const numericGrade = parseFloat(grade);
  
  if (isNaN(numericGrade)) return 'gray';

  if (numericGrade >= 16) return 'emerald';  // Excellent (Très Bien)
  if (numericGrade >= 14) return 'green';    // Very Good (Bien)
  if (numericGrade >= 12) return 'lime';     // Good (Assez Bien)
  if (numericGrade >= 10) return 'yellow';   // Satisfactory (Passable)
  if (numericGrade >= 5) return 'orange';    // Needs Improvement (Insuffisant)
  return 'red';                              // Poor (Médiocre)
}

// Alternative version that returns full Tailwind classes for direct use:
export function getGradeColorClass(grade) {
  const numericGrade = parseFloat(grade);
  
  if (isNaN(numericGrade)) return 'text-gray-500 bg-gray-100';

  if (numericGrade >= 16) return 'text-emerald-700 bg-emerald-50';   // Excellent
  if (numericGrade >= 14) return 'text-green-700 bg-green-50';       // Very Good
  if (numericGrade >= 12) return 'text-lime-700 bg-lime-50';         // Good
  if (numericGrade >= 10) return 'text-yellow-700 bg-yellow-50';     // Satisfactory
  if (numericGrade >= 5) return 'text-orange-700 bg-orange-50';      // Needs Improvement
  return 'text-red-700 bg-red-50';                                   // Poor
}
export const PRIOTITYSTYELS = {
  high: "text-red-600",
  medium: "text-yellow-600",
  low: "text-blue-600",
};

export const TASK_TYPE = {
  todo: "bg-blue-600",
  "in progress": "bg-yellow-600",
  completed: "bg-green-600",
};

export const BGS = [
  "bg-blue-600",
  "bg-yellow-600",
  "bg-red-600",
  "bg-green-600",
];
