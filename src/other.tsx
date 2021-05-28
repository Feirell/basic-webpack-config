import React from 'react';

interface OtherInterface {

}

export interface Test extends OtherInterface {

}

function Deco(args: any): any {
    return function () {
    }
}

class Example {
    @Deco(12)
    prop: any = 22;
}

export type Nothing = void;

function* numbers() {
    for (let i = 0; i < 10; i++) {
        yield Math.floor(i / 2);
    }
}

export const TestComp = () => {
    const nrs = [];

    for (const nr of numbers())
        nrs.push(<span key={nrs.length}>{nr}</span>);

    return <h1>this is another component: {nrs}</h1>;
}
