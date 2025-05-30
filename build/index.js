import m from "mithril";
// Вопросы
const questions = [
    {
        question: "How do you intend to use this mailbox — for business or personal purposes?",
        choices: [
            { option: "For business purposes", plans: { Essential: 1, Advanced: 1, Unlimited: 1 } },
            { option: "For personal use", plans: { Free: 1, Revolutionary: 1, Legend: 1 } },
            { option: "I’m not sure yet", plans: { Free: 1 } }
        ],
    },
    {
        question: "Would you like to add additional email addresses to this mailbox?",
        choices: [
            { option: "Yes", plans: { Revolutionary: 1, Legend: 1, Essential: 1, Advanced: 1, Unlimited: 1 } },
            { option: "No", plans: { Free: 1 } }
        ],
    },
    {
        question: "If applicable, how many additional email addresses do you require?",
        choices: [
            { option: "1-15", plans: { Essential: 1, Revolutionary: 1 } },
            { option: "16-30", plans: { Legend: 1, Unlimited: 1, Advanced: 1, } },
            { option: "No need", plans: { Free: 1 } },
        ],
    },
    {
        question: "Would you like to use your own domain (e.g., yourcompany.com) with this mailbox?",
        choices: [
            {
                option: "Yes",
                plans: { Revolutionary: 1, Legend: 1, Essential: 1, Advanced: 1, Unlimited: 1 }
            },
            { option: "No", plans: { Free: 1 } }
        ],
    },
    {
        question: "If applicable, how many custom domains would you like to configure?",
        choices: [
            { option: "1-3", plans: { Essential: 1, Revolutionary: 1 } },
            { option: "4-10", plans: { Legend: 1, Advanced: 1 } },
            { option: "unlimited", plans: { Unlimited: 1 } }
        ],
    },
    {
        question: "How many calendars do you plan to use?",
        choices: [
            { option: "One", plans: { Free: 1 } },
            {
                option: "Unlimited calendars",
                plans: { Revolutionary: 1, Legend: 1, Essential: 1, Advanced: 1, Unlimited: 1 }
            }
        ],
    },
    {
        question: "What is your estimated email storage requirement?",
        choices: [
            { option: "1 GB", plans: { Free: 1 } },
            { option: "2-20 GB", plans: { Revolutionary: 1 } },
            { option: "21-50 GB", plans: { Essential: 1 } },
            { option: "51-500 GB", plans: { Legend: 1, Advanced: 1 } },
            { option: "501-1000 GB", plans: { Unlimited: 1 } }
        ],
    }
];
// Компонент Questionnaire
const Questionnaire = {
    //Зачем нужен oninit: 1. Инициализация состояния компонента, 2. Подготовка переменных, флагов, логики до того, как компонент появится на экране. 3. Сброс или очистка данных при повторной инициализации (например, при переходах)
    oninit(vnode) {
        vnode.state.currentIndex = 0;
        vnode.state.answers = [];
        vnode.state.plan = "";
        vnode.state.hoverStates = {};
        vnode.state.animation = false;
        vnode.state.showResultContainer = true;
        vnode.state.showQuestionContainer = true;
        vnode.state.selectedIndex = 1; //for the final page "slider movement"
        //Final page: slider
        vnode.state.moveToSelected = (directionOrIndex) => {
            let newIndex = vnode.state.selectedIndex;
            if (directionOrIndex === "prev") {
                newIndex = Math.max(0, newIndex - 1);
            }
            else if (directionOrIndex == "next") {
                newIndex = Math.min(2, newIndex + 1);
            }
            else {
                newIndex = directionOrIndex;
            }
            vnode.state.selectedIndex = newIndex;
        };
        vnode.state.evaluatePlan = (answers) => {
            // Найдём тариф с наибольшим количеством баллов
            const score = {
                Free: 0,
                Revolutionary: 0,
                Legend: 0,
                Essential: 0,
                Advanced: 0,
                Unlimited: 0
            };
            for (const answer of answers) {
                for (const plan in answer.plans) {
                    if (Object.prototype.hasOwnProperty.call(score, plan)) {
                        score[plan] += answer.plans[plan];
                    }
                }
            }
            const result = Object.entries(score).reduce((max, curr) => curr[1] > max[1] ? curr : max);
            return result[0]; //название тарифа
        };
    },
    view: function (vnode) {
        const state = vnode.state;
        const showResultContainer = vnode.state.showResultContainer;
        const showQuestionContainer = vnode.state.showQuestionContainer;
        /*
                const showQuestionContainer = vnode.state.showQuestionContainer;
        */
        //result to show
        if (state.currentIndex >= questions.length) {
            state.plan = state.evaluatePlan(state.answers);
            //Logic for the carusel -------------------------------------
            const getStyle = (index) => {
                const base = {
                    position: "absolute",
                    top: "50%",
                    transform: "translateY(-50%)",
                    transition: "all 0.6s ease",
                    padding: "50px",
                    borderRadius: "10px",
                    textAlign: "center",
                    fontSize: "20px",
                    backgroundColor: "#f4f4f4",
                    opacity: 1,
                    zIndex: 1
                };
                if (index === state.selectedIndex) {
                    return { ...base, left: "50%", transform: "translateX(-50%) translateY(0)", zIndex: 10 };
                }
                else if (index === state.selectedIndex - 1) {
                    return {
                        ...base,
                        left: "30%",
                        transform: "translateX(-50%) translateY(20px)",
                        opacity: 0.7,
                        zIndex: 5
                    };
                }
                else if (index === state.selectedIndex + 1) {
                    return {
                        ...base,
                        left: "70%",
                        transform: "translateX(-50%) translateY(20px)",
                        opacity: 0.7,
                        zIndex: 5
                    };
                }
                else {
                    return { display: "none" };
                }
            };
            //-------------------------------------------------------------
            return showResultContainer && m("div", {
                style: {
                    maxWidth: "800px",
                    padding: "10px",
                    margin: "0 auto",
                    textAlign: "center",
                    fontFamily: "sans-serif",
                    boxSizing: "border-box"
                }
            }, [
                m("h2", {
                    style: "max-width: 800px; padding: 10px; margin: 0 auto; text-align: center;"
                }, "Recommended plan is:"),
                m("p", {
                    style: "max-width: 800px; padding: 10px; margin: 0 auto; text-align: center; font-size: 25px;"
                }, state.plan),
                //aded carusel here----------------------------------------
                m("div", {
                    style: {
                        width: "100%",
                        height: "400px",
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        position: "relative",
                        overflow: "hidden",
                        marginTop: "40px"
                    }
                }, [
                    m("div", {
                        style: {
                            position: "relative",
                            width: "100%",
                            height: "100%"
                        },
                        oncreate: ({ dom }) => {
                            const onWheel = (event) => {
                                const e = event;
                                event.preventDefault();
                                if (e.deltaY > 0) {
                                    state.moveToSelected("next");
                                }
                                else {
                                    state.moveToSelected("prev");
                                }
                                m.redraw();
                            };
                            dom.addEventListener("wheel", onWheel, { passive: false });
                        }
                    }, [
                        m("div", {
                            style: getStyle(0),
                            onclick: () => state.moveToSelected(0)
                        }, "Text 1"),
                        m("div", {
                            style: getStyle(1),
                            onclick: () => state.moveToSelected(1)
                        }, "Text 2"),
                        m("div", {
                            style: getStyle(2),
                            onclick: () => state.moveToSelected(2)
                        }, "Text 3"),
                    ]),
                ]),
                m("button", {
                    style: {
                        width: "200px",
                        fontWeight: "700",
                        color: "#fff",
                        padding: "10px 0",
                        background: "linear-gradient(45deg, #ff1f4f, #d2002d 100%",
                        borderRadius: "100px",
                        margin: "0 10px",
                        cursor: "pointer",
                        fontSize: "17px",
                        textAlign: "center",
                        minWidth: "60px",
                        height: "50px",
                    },
                    onclick: () => {
                        state.currentIndex = 0;
                        state.answers = [];
                        state.plan = "";
                        /*for(let key in score) score[key as keyof typeof score]=0;*/
                    }
                }, "Try again"),
                m("button", {
                    style: {
                        width: "200px",
                        fontWeight: "700",
                        color: "#850122",
                        padding: "10px 0",
                        background: "linear-gradient(45deg, rgb(153, 113, 122), rgb(53, 46, 60) 100%);",
                        borderRadius: "100px",
                        margin: "0 10px",
                        cursor: "pointer",
                        fontSize: "17px",
                        textAlign: "center",
                        minWidth: "60px",
                        height: "50px",
                    },
                    onclick: () => {
                        /* "this.parentNode.style.display = 'none';"*/
                        vnode.state.showResultContainer = false;
                    }
                }, "Close"),
            ]);
        }
        // Current questions with options
        const current = questions[state.currentIndex];
        return showQuestionContainer && m("div", {
            style: {
                maxWidth: "800px",
                margin: "0 auto",
                fontFamily: "sans-serif",
                opacity: state.animation ? "0" : "1",
                transition: "opacity 0.6s ease-in-out"
            }
        }, [
            m("div", [
                m("button", {
                    style: {
                        fontSize: "14px",
                        color: "#000",
                        textAlign: "center",
                        backgroundColor: "#3333330d",
                        marginRight: "2%",
                        marginTop: "1%",
                        float: "right",
                        borderRadius: "50%",
                        cursor: "pointer",
                        lineHeight: "20px",
                        padding: "0px 5px"
                    },
                    onclick: () => {
                        vnode.state.showQuestionContainer = false;
                    }
                }, "x"),
                m("h2", {
                    style: {
                        padding: "30px 30px 10px 50px",
                        margin: 0,
                        fontSize: "18px"
                    }
                }, current.question),
            ]),
            m("ul", {
                style: {
                    listStyle: "none",
                    position: "relative",
                    padding: "0"
                }
            }, [
                ...current.choices.map((choice, index) => {
                    const inputId = `choice-${state.currentIndex}-${index}`;
                    const hoverKey = `${state.currentIndex}-${index}`;
                    const isHovered = state.hoverStates[hoverKey];
                    return m("li", {
                        onmouseover: () => {
                            state.hoverStates[hoverKey] = true;
                            m.redraw();
                        },
                        onmouseout: () => {
                            state.hoverStates[hoverKey] = false;
                            m.redraw();
                        },
                        style: {
                            listStyle: "none",
                            position: "relative",
                            borderTop: "1px solid #eee",
                            backgroundColor: isHovered ? "#ffedea" : "transparent",
                            transition: "background-color 0.2s"
                        }
                    }, m("label", {
                        for: inputId,
                        style: {
                            cursor: "pointer",
                            padding: "1.5rem 2.5rem 1.5rem 5rem",
                            position: "relative",
                            width: "100%",
                            margin: "0",
                            fontSize: "16px",
                            display: "inline-block",
                            verticalAlign: "middle",
                            lineHeight: "1.5",
                            boxSizing: "border-box"
                        }
                    }, [m("input[type=radio]", {
                            id: inputId,
                            name: `choice-${state.currentIndex}`,
                            value: choice,
                            style: {
                                cursor: "pointer",
                                display: "none"
                            },
                            onclick: () => {
                                state.selectedId = inputId;
                                state.animation = true; // старт исчезновения
                                m.redraw();
                                setTimeout(() => {
                                    state.answers.push(choice);
                                    state.currentIndex++;
                                    state.selectedId = null;
                                    state.animation = false; //появление нового вопроса
                                    m.redraw();
                                }, 500); // синхронизировано с transition: 0.5s
                            }
                        }),
                        m("", {
                            style: {
                                display: "flex",
                                alignItems: "center",
                                gap: "16px"
                            }
                        }, m("span", {
                            style: {
                                width: "20px",
                                height: "20px",
                                border: "1px solid #bbb",
                                borderRadius: "50%",
                                background: state.selectedId === inputId ? "#d93951" : "transparent"
                            }
                        }, state.selectedId === inputId ? m("span", {
                            style: {
                                color: "white"
                            }
                        }, m.trust("<svg xmlns=\"http://www.w3.org/2000/svg\" class=\"ionicon\" viewBox=\"0 0 512 512\"><path fill=\"none\" stroke=\"currentColor\" stroke-linecap=\"round\" stroke-linejoin=\"round\" stroke-width=\"32\" d=\"M416 128L192 384l-96-96\"/></svg>")) : ""), m("span", choice.option))
                    ]));
                })
            ])
        ]);
    },
};
//  Старт или продолжение
const App = {
    oninit(vnode) {
        vnode.state.started = false;
        vnode.state.animation = false;
        //styles to body
        Object.assign(document.body.style, {
            margin: "0",
            padding: "0",
            background: "#eee",
            /* background: "#fff2ea",*/
            fontFamily: "sans-serif",
            boxSizing: "border-box"
        });
    },
    view(vnode) {
        return m("div", { style: "position: relative; max-width: 800px; margin: 40px auto 0 auto; background: #fff; border-radius: 20px;" }, [
            vnode.state.started
                ? m(Questionnaire)
                : m("div", {
                    style: "max-width: 800px; padding: 10px; margin: 0 auto; /*text-align: center;*/; display: flex; flex-direction: row; justify-content: center; align-items: center; border-box: 20px;"
                }, [m("div", {
                        style: {
                            display: "flex",
                            justifyContent: "center",
                            flexDirection: "column",
                            maxWidth: "400px",
                            padding: "10px",
                            opacity: vnode.state.animation ? "0" : "1",
                            transition: "opacity 0.6s ease-in-out"
                        }
                    }, [m("p", { style: { fontSize: "18px", } }, "Confused about which plan to choose?"),
                        m("h2", {
                            style: {
                                fontSize: "30px",
                                padding: "5px 0px",
                                margin: "auto",
                            }
                        }, "Take our 1-minute quiz to find your plan."),
                        m("p", "We’ll show you the best match based on your needs and daily activities.")]),
                    m("button", {
                        style: {
                            width: "200px",
                            fontWeight: "700",
                            color: "#fff",
                            padding: "10px 0",
                            backgroundColor: "#850122",
                            borderRadius: "100px",
                            margin: "0 auto",
                            cursor: "pointer",
                            fontSize: "17px",
                            textAlign: "center",
                            minWidth: "60px",
                            height: "50px",
                            opacity: vnode.state.animation ? "0" : "1",
                            transition: "opacity 0.6s ease-in-out"
                        },
                        onmouseover: (e) => {
                            e.target.style.backgroundColor = "#be8f96";
                        },
                        onmouseout: (e) => {
                            e.target.style.backgroundColor = "#850122";
                        },
                        onclick: () => {
                            vnode.state.animation = true;
                            /*  vnode.state.started = true;*/
                            m.redraw();
                            setTimeout(() => {
                                vnode.state.started = true;
                                vnode.state.animation = false; // сброс
                                m.redraw(); // показать Questionnaire
                            }, 600); // время анимации должно совпадать с transition
                        }
                    }, "Start Now")
                ])
        ]);
    }
};
// Точка входа
m.mount(document.body, App);
