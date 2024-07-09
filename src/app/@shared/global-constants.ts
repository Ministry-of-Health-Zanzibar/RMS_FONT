export class GlobalConstants {
    //message
    public static genericError: string = "Something went wrong. Please try again later";
    public static genericErrorConnectFail: string = "Something went wrong in application. Please contact to system administrator";

    public static unauthroized: string = "You are not authorized person to access this page.";


    //regex
    public static nameRegex: string = "[a-zA-Z0-9 ]+";

    public static phoneNoRegex: string = "^0\\d{9}$";

    public static nameRegexCharater: string = "[a-zA-Z0-9, ']+";

    public static nameRegexOnly: string = "[a-zA-Z ]+";

    public static emailRegex: string = "[A-Za-z0-9._%-]+@[A-Za-z0-9._%-]+\\.[a-z]{2,3}";

    public static contactNumberRegex: string = "^[e0-9]{10,10}$";

    public static spaceRegex: string = "/^(\s+\S+\s*)(?!\s).$/";

    public static nameSpaceRegex: string = "/^[a-zA-Z]+(?:\s[a-zA-Z]+)*$/";

    public static numberOnly: string = "^[0-9]+$";

    public static clearCatch: string = "Clear catch and Refresh the page";




    // variable
    public static error: string = "error";


}
