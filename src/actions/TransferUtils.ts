import { Movie } from "../models/Movie";
import TitleBreakout from "../models/TitleBreakout";

export const RATING_REGEX = /^[0-9]*\.*[0-9]*\/[0-9]+$/;

export const extractRating = (movie: Movie) => {
    let rating = '';

    for(let i = 0; i < movie.content.length; i++) {
        const content = movie.content[i].trim();
        if(content.match(RATING_REGEX)) {
            return content;
        }
    }

    return rating;
}

const extractTitleAndYear = (rawTitle: string) : string[] => {
    const lastOpenParen = rawTitle.lastIndexOf('(');
    return [rawTitle.substr(0, lastOpenParen), rawTitle.substr(lastOpenParen, rawTitle.length-1)];
}

export const breakoutTitleYearAndCategory = (rawTitle: string): TitleBreakout | null => {
    let res: string[] = [];

    if(rawTitle.indexOf("#") === 0) {
        // Halloween 2020
        const parts = rawTitle.split('–');
        const titleAndYear = extractTitleAndYear(parts[3].trim());
        const week = parts[1].trim();
        const num = parts[2].trim();

        return {
            title: titleAndYear[0], 
            year: titleAndYear[1], 
            category: 'Halloween 2020', 
            categoryCls: 'halloween_2020', 
            subCategory: week,
            order: num
        };
    }
    else if(rawTitle.match(/.* – Movie [0-9]+ – .*/)) {
        // Nov/Dec 2020
        const parts = rawTitle.split('–');
        const titleAndYear = extractTitleAndYear(parts[2].trim());

        return {
            title: titleAndYear[0], 
            year: titleAndYear[1], 
            category: 'Nov/Dec 2020', 
            categoryCls: 'nov_dec_2020', 
            subCategory: parts[0].trim(),
            order: parts[1].trim()
        };
    }
    else if(rawTitle.indexOf('–') < 0) {
        // Gamera
        const titleAndYear = extractTitleAndYear(rawTitle.trim());

        return {
            title: titleAndYear[0], 
            year: titleAndYear[1], 
            category: 'Gamera', 
            categoryCls: 'gamera'
        };
    }
    else if(rawTitle.indexOf('Randomizer') === 0) {
        // Randomizer
        const parts = rawTitle.split('–');
        const titleAndYear = extractTitleAndYear(parts[1].trim());

        return {
            title: titleAndYear[0], 
            year: titleAndYear[1], 
            category: 'Randomizer', 
            categoryCls: 'randomizer',
            order: parts[0].split('#')[1]
        };
    }
    else if(rawTitle.indexOf('March Madness') === 0) {
        // March Madness
        const parts = rawTitle.split('–');
        const titleAndYear = extractTitleAndYear(parts[1].trim());

        return {
            title: titleAndYear[0], 
            year: titleAndYear[1], 
            category: 'March Madness', 
            categoryCls: 'march_madness',
            order: parts[0].split('#')[1]
        };
    }
    else if(rawTitle.indexOf('Genres') === 0) {
        // Genres
        const parts = rawTitle.split('–');
        const titleAndYear = extractTitleAndYear(parts[2].trim());
        const subCategory = parts[1].trim();
        const subParts = subCategory.split('#');

        return {
            title: titleAndYear[0], 
            year: titleAndYear[1], 
            category: 'Genres', 
            categoryCls: 'genres', 
            subCategory: subParts[0].trim(),
            order: subParts[1].trim()
        };
    }

    return null;
}