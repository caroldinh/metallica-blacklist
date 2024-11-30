import React, { useState, useEffect } from "react";

export const ReceptionCategories = () => {
    return (
        <ul id="reception-category-list">
            <li><span class="proficiency">PROFICIENCY:</span>Did the cover demonstrate the artist's creative or technical competence?</li>
            <li><span class="composition">COMPOSITION:</span>Did a structural element of the cover stand out?</li>
            <li><span class="interpretation">INTERPRETATION:</span>Did the artist's emotional delivery of the song add additional value?</li>
            <li><span class="instrumentation">INSTRUMENTATION:</span>Did something about the instrumentals stand out?</li>
            <li><span class="reputation">REPUTATION:</span>Did the artist's previous credits or name recognition draw attention?</li>
            <li><span class="genre">GENRE:</span>Did this cover transform the song's style or genre in a notable way?</li>
            <li><span class="loyalty">LOYALTY:</span>How much did this cover adhere to the original recording?</li>
            <li><span class="uniqueness">UNIQUENESS:</span>How many other versions of this song were covered on the Blacklist?</li>
            <li><span class="memorability">MEMORABILITY:</span>Which covers stood out enough to be mentioned, even if not for any of the specified reasons above?</li>
        </ul>
    )
}