export const APP_CONSTS = {
    // navigation paths
    INDEX_PATH: '',
    LOGGED_IN_PATH: '/home',
    LOGGED_OUT_PATH: '/login',
    LOGIN_PATH: '/login',
    CHAPTER_PATH: '/chapter',
    ACHIEVED_CHAPTER_PATH: '/achieved',
    EDUCATIONAL_PLAN_PATH: '/educationalPlan',
    CHANGE_AVATAR_PATH: '/changeavatar',
    CHANGE_PASSWORD_PATH: '/changepw',
    DELETE_PROFILE_PATH: '/deleteprofile',
    NOT_FOUND_PATH: '**',
    LOCALSTORAGE_TOKEN_ID: 'token',
    EMPTY_STRING: '',

    // TOOLTIP SERVICE CONFIG
    TOOLTIP_STYLE_TAG_ID: 'tooltipStyle',
    TOOLTIP_COMPETENCE_CSS: `
.tooltip {
    z-index:500;
}
.tooltip .tooltip-inner {
    background-color: #001a3a;
    color: white;
    text-align: left;
    padding: 10px 15px;
    width: 250px;
    max-width: 250px;
    min-width: 250px;
    top: 200px;
    /*
    min-height: 60px;
    transform: translateY(20%);
    */
    border: 3px solid white;
}

.tooltip.right .tooltip-arrow {
    margin-top: -6px;
    border-width: 6px 6px 6px 0;
    border-right-color: white;
}

.tooltip.right {
    margin-left: 12px;
    padding: 0 6px;
}`,
    TOOLTIP_INPUT_CSS: `
.tooltip {
    z-index:500;
}
.tooltip .tooltip-inner {
    background-color: #d3ddf2;
    color: #001a3a;
    text-align: left;
    padding: 10px 15px;
    width: 300px;
    max-width: 300px;
    min-width: 300px;
    /*
    margin-top: 50px;
    height: 90px;
    */
}

.tooltip.right .tooltip-arrow {
    margin-top: -6px;
    border-width: 6px 6px 6px 0;
    border-right-color: #d3ddf2;
}

.tooltip.right {
    margin-left: 5px;
    padding: 0 6px;
}`
};