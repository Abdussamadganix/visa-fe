
export class Constants {

    public static sandboxDocs = 'https://xpresspayonlinedocssandbox.xpresspayments.com/#/';
    public static sandboxFeURL = 'https://xpresspayonlinesandbox.xpresspayments.com'
    //public static sandboxApiURl = 'https://visa-be.herokuapp.com/v1';
    public static sandboxApiURl = 'http://localhost:8099/v1';

    public static API_ENDPOINT = Constants.sandboxApiURl;
    public static ACTIVATION_LINK = Constants.sandboxFeURL + '/activate-email/[[token]]';
    public static RESET_LINK = Constants.sandboxFeURL + '/reset-link/[[token]]';
    public static SET_PASSWORD = Constants.sandboxFeURL + '/set-password/[[token]]';
    public static FORGOT_PASSWORD = Constants.sandboxFeURL  + '/forgotPassword/[[token]]';
    public static DOCS =  Constants.sandboxDocs;
}
