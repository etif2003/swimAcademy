export const MESSAGES = {
  COMMON: {
    MISSING_FIELDS: "חסרים שדות חובה",
    INVALID_ID: "מזהה לא תקין",
    NOT_FOUND: "פריט לא נמצא",
    NO_DATA_TO_UPDATE: "לא נשלחו נתונים לעדכון",
    UNAUTHORIZED: "אין הרשאה לבצע פעולה זו",
  },

  AUTH: {
    MISSING_CREDENTIALS: "יש להזין אימייל וסיסמה",
    INVALID_CREDENTIALS: "אימייל או סיסמה שגויים",
    WRONG_PASSWORD: "הסיסמה הנוכחית שגויה",
    MISSING_PASSWORDS: "יש להזין סיסמה נוכחית וסיסמה חדשה",
    PASSWORD_UPDATED: "הסיסמה עודכנה בהצלחה",
  },

  USER: {
    MISSING_USER_ID: "מזהה משתמש חסר",
    INVALID_ID: "מזהה משתמש לא תקין",
    NOT_FOUND: "משתמש לא נמצא",
    INVALID_EMAIL: "כתובת האימייל אינה תקינה",
    INVALID_PHONE: "מספר הטלפון אינו תקין",
    WEAK_PASSWORD: "הסיסמה חייבת להכיל לפחות 6 תווים",
    EMAIL_EXISTS: "האימייל כבר נמצא בשימוש",
    INVALID_ROLE: "תפקיד לא חוקי",

    STUDENT_HAS_REGISTRATIONS:
      "סטודנט לא נמחק כי יש לו הרשמות, הסטטוס הועבר ל'לא פעיל'",
    INSTRUCTOR_HAS_COURSES:
      "מדריך לא נמחק כי יש לו קורסים, הסטטוס הועבר ל'לא פעיל'",
    SCHOOL_HAS_COURSES:
      "בית ספר לא נמחק כי יש לו קורסים פעילים, הסטטוס הועבר ל'לא פעיל'",

    DELETED_SUCCESS: "המשתמש נמחק בהצלחה",
  },

  COURSE: {
    INVALID_ID: "מזהה קורס לא תקין",
    NOT_FOUND: "קורס לא נמצא",
    ALREADY_EXISTS: "כבר קיים קורס עם שם זה",
    INVALID_CATEGORY: "קטגוריית קורס לא חוקית",
    INVALID_PRICE: "מחיר הקורס אינו תקין",
    NOT_ACTIVE: "לא ניתן להירשם לקורס לא פעיל",
    FULL: "הקורס מלא",
    NO_PERMISSION: "אין הרשאה לבצע פעולה זו על קורס זה",
    DELETED_SUCCESS: "הקורס נמחק בהצלחה",
    MISSING_CREATOR: "יוצר קורס חסר",
    INVALID_CREATOR_ID: "מזהה יוצר לא תקין",
    INVALID_CREATOR_TYPE: "סוג יוצר לא תקין",

    HAS_REGISTRATIONS: "לקורס זה כבר יש הרשמות ולכן לא ניתן למחוק אותו",
  },

  REGISTRATION: {
    MISSING_FIELDS: "חסרים פרטי הרשמה",
    INVALID_ID: "מזהה הרשמה לא תקין",
    NOT_FOUND: "הרשמה לא נמצאה",
    ALREADY_EXISTS: "המשתמש כבר רשום לקורס זה",
    INVALID_STATUS: "סטטוס הרשמה לא חוקי",
    CANCELLED_SUCCESS: "ההרשמה בוטלה בהצלחה",
  },

  SCHOOL: {
    INVALID_ID: "מזהה בית ספר לא תקין",
    NOT_FOUND: "בית ספר לא נמצא",
    NAME_REQUIRED: "שם בית הספר הוא שדה חובה",
    ALREADY_EXISTS: "כבר קיים בית ספר למשתמש זה",
    INVALID_PHONE: "מספר טלפון ליצירת קשר אינו תקין",
    DELETED_SUCCESS: "בית הספר נמחק בהצלחה",
      USER_NOT_SCHOOL: "המשתמש אינו מוגדר כבעל בית ספר",

  },

  INSTRUCTOR: {
    INVALID_ID: "מזהה מדריך לא תקין",
    NOT_FOUND: "פרופיל מדריך לא נמצא",
    ALREADY_EXISTS: "כבר קיים פרופיל מדריך למשתמש זה",
    MISSING_REQUIRED_FIELDS: "חסרים פרטי חובה לפרופיל מדריך",
    USER_NOT_INSTRUCTOR: "המשתמש אינו רשום כמדריך",
    DELETED_SUCCESS: "פרופיל המדריך נמחק בהצלחה",
  },

  SCHOOL_INSTRUCTOR: {
    INVALID_ID: "מזהה שיוך לא תקין",
    NOT_FOUND: "שיוך לא נמצא",
    ALREADY_EXISTS: "המדריך כבר משויך לבית הספר",
    REMOVED_SUCCESS: "שיוך המדריך לבית הספר בוטל בהצלחה",
      INVALID_IDS: "מזהה מדריך או בית ספר לא תקין",

  },
};
