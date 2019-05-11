import React, {Component} from 'react';
import connect from "react-redux/es/connect/connect";

import {removeSchedItem} from "../../actions";

import './schedule.css'
import Days from './Days'
import Times from './Times'
import Block from './Block'
import GridLines from './GridLines'

// Used for box coloring, from StackOverflow:
// https://stackoverflow.com/questions/7616461/generate-a-hash-from-string-in-javascript
String.prototype.hashCode = function() {
    let hash = 0, i, chr;
    if (this.length === 0) return hash;
    for (i = 0; i < this.length; i++) {
        chr   = this.charCodeAt(i);
        hash  = ((hash << 5) - hash) + chr;
        hash |= 0; // Convert to 32bit integer
    }
    return hash;
};

// From an array of meetings, get the groups which conflict in timing.
export const getConflictGroups = (meetings) => {
    // returns true if the two meetings conflict.
    const overlap = (m1, m2) => {
        let start1 = m1.data.start;
        let start2 = m2.data.start;
        let end1 = m1.data.end;
        let end2 = m2.data.end;
        return m1.data.day === m2.data.day && !(end1 <= start2 || end2 <= start1)
    }
    // get a unique ID for a course's meeting
    const id = m => {
        return `${m.course.id}-${m.data.day}-${m.data.start}-${m.data.end}`
    }

    // `conflicts` is a union-find datastructure representing "conflict sets".
    // https://en.wikipedia.org/wiki/Disjoint-set_data_structure
    // meetings m1 and m2 are in the same conflict set if m1 and m2 conflict
    // with at least one meeting m3 which is also in the set (m3 can be m1 or m2).
    let conflicts = {};
    const merge = (m1, m2) => {
        conflicts[id(m1)] = conflicts[id(m2)] = new Set([...conflicts[id(m1)], ...conflicts[id(m2)]]);
    }

    meetings.forEach(m => {
        conflicts[id(m)] = new Set([m])
    })

    // compare every pair of meetings. if they overlap, merge their sets.
    for (let i = 0; i < meetings.length-1; i++) {
        for (let j = i+1; j < meetings.length; j++) {
            if (overlap(meetings[i], meetings[j])) {
                merge(meetings[i], meetings[j])
            }
        }
    }

    // remove sets of size 1 from the results; they're not conflicting with anything.
    for (const key of Object.keys(conflicts)) {
        if (conflicts[key].size <= 1) {
            delete conflicts[key]
        }
    }
    // use a Set to remove duplicates, so we get only unique conflict sets.
    return Array.from(new Set(Object.values(conflicts)).values());
}

class Schedule extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        let {schedData, removeSection} = this.props;
        let sections = schedData.meetings || [];

        if (sections.length < 1) {
            return <EmptySchedule />
        }

        let startHour = 10;
        let endHour = 15.5;

        // get the minimum start hour and the max end hour to set bounds on the schedule.
        startHour = Math.min(startHour, ...sections.map(m => m.meetHour)) - 1;
        endHour = Math.max(endHour, ...sections.map(m => m.meetHour + m.hourLength)) + 1;

        const showWeekend = sections.filter(
            sec => sec.meetDay.indexOf('S') !== -1 || sec.meetDay.indexOf('U') !== -1).length > 0;

        // actual schedule elements are offset by the row/col offset since
        // days/times take up a row/col respectively.
        let rowOffset = 1;
        let colOffset = 1;

        const getNumRows = () => {
            return (endHour - startHour) * 2 + rowOffset;
        }
        const getNumCol = () => {
            return 5 + colOffset + (showWeekend ? 2 : 0);
        }

        // step 2 in the CIS121 review: hashing with linear probing.
        // hash every section to a color, but if that color is taken, try the next color in the
        // colors array. Only start reusing colors when all the colors are used.
        const getColor = (() => {
            const colors = ["blue", "red", "aqua", "orange", "green", "pink", "sea", "indigo"];
            let used = []; // some CIS120: `used` is a *closure* storing the colors currently in the schedule
            return c => {
                if (used.length === colors.length) {
                    // if we've used all the colors, it's acceptable to start reusing colors.
                    used = [];
                }
                let i = c.hashCode();
                while (used.indexOf(colors[i % colors.length]) !== -1) {
                    i++;
                }
                const color = colors[i % colors.length]
                used.push(color)
                return color;
            }
        })()
        const sectionIds = sections.map(x => x.idDashed);
        let meetings = [];
        sections.forEach(m => {
            let days = m.meetDay.split('');
            const color = getColor(m.idDashed);
            meetings.push(...days.map(d => {
                return {
                    data: {
                        day: d,
                        start: m.meetHour,
                        end: m.meetHour + m.hourLength
                    },
                    course: {
                        id: m.idDashed,
                        fullID: m.fullID,
                        color: color,
                        coreqFulfilled: m.SchedAsscSecs.filter(
                            coreq => sectionIds.indexOf(coreq) !== -1
                        ).length === 0
                    },
                    style: {
                        width: '100%',
                        left: 0,
                    }
                }
            }))
        })
        let conflicts = getConflictGroups(meetings)
        for (const conflict of conflicts) {
            // for every conflict of size k, make the meetings in that conflict
            // take up (100/k) % of the square, and use `left` to place them
            // next to each other.
            const group = Array.from(conflict.values())
            const w = 100 / group.length;
            for (let j = 0; j < group.length; j++) {
                group[j].style = {
                    width: `${w}%`,
                    left: `${w*j}%`
                }
            }
        }
        let blocks = meetings.map(meeting => (
            <Block
                meeting={meeting.data}
                offsets={{
                    time: startHour,
                    row: rowOffset,
                    col: colOffset,
                }}
                key={`${meeting.course.id}-${meeting.data.day}`}
                id={meeting.course.id}
                color={meeting.course.color}
                remove={() => removeSection(meeting.course.fullID)}
                style={meeting.style}
                showWarning={meeting.course.coreqFulfilled}
            />
        ))

        let dims = {
            gridTemplateColumns: `.4fr repeat(${getNumCol() - 1}, 1fr)`,
            gridTemplateRows: `repeat(${getNumRows()}, 1fr)`,
        }

        return (
            <div className={'schedule box'} style={dims}>
                <Days offset={colOffset} weekend={showWeekend} />
                <Times
                    startTime={startHour}
                    endTime={endHour}
                    numRow={getNumRows()}
                    offset={rowOffset}

                />
                <GridLines
                    numRow={getNumRows()}
                    numCol={getNumCol()}
                />
                {blocks}
            </div>
        )
    }
}

const mapStateToProps = (state) => {
    return {
        schedData: state.schedule.schedules[state.schedule.scheduleSelected]
    };
};

const mapDispatchToProps = (dispatch) => (
    {
        removeSection: idDashed => dispatch(removeSchedItem(idDashed))
    }
);

export default connect(mapStateToProps, mapDispatchToProps)(Schedule);

const EmptySchedule = () => (
    <div className={'box'} style={{height: '100%'}}>
        <p style={{fontSize: "1.5em", marginTop: "7em", display: "block"}}>
            Search for courses above <br/>then click a section's + icon to add it to the schedule.
        </p>
        <p style={{fontSize: "1em"}}>
            These are mock schedules.
            <br/>
            You still need to register for your classes on Penn InTouch.
        </p>
    </div>
);