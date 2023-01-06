'use strict';

function validateTags(tags) {
    const tagList = ["work, lifestyle", "mobile", "motor"]
    tags.forEach(tag => {
        if(!(tag in tagList)) {
            return false
        }
    });
    return true
}

module.exports = validateTags()