'use strict';

function validateTags(tags) {
    const tagList = ["work", "lifestyle", "mobile", "motor"]
    let isValid = true
    tags.forEach(tag => {
        if(isValid && tagList.indexOf(tag) ===-1 ) {
            isValid = false
        }
    });
    return isValid
}

module.exports = validateTags()