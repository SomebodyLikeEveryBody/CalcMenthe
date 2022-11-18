function Controller(pQuestionWidget, pAnswerWidget) {
    this.QUESTION_ASKED_STATUS = 0;
    this.QUESTION_ANSWERED_STATUS = 1;
    this.UNDEFINED_STATUS = -1;

    this.questionWidget = pQuestionWidget;
    this.answerWidget = pAnswerWidget;
    this.status = this.QUESTION_ASKED_STATUS;
    this.questionsManager = new QuestionsManager();

    /*
     * 
     * * */
    this.getGoodAnswer = function () {
        return (this.questionsManager.currentAnswer);
    };

    this.propoundNewQuestion = function () {
        this.questionWidget.displayNewQuestion(this.questionsManager.generateQuestion());
        this.status = this.QUESTION_ASKED_STATUS;
        this.answerWidget.clear();
        this.answerWidget.focus();
        this.answerWidget.displayDefaultStyle();
    };

    this.setEvents = function () {
        let that = this;

        this.questionWidget.jqEl.click(function () {
            if (that.status === that.QUESTION_ASKED_STATUS) {
                that.status = that.QUESTION_ANSWERED_STATUS;
                that.questionWidget.jqEl.fadeOut(100, function () {
                    that.questionWidget.setContent(that.questionsManager.redactedAnswer);
                    that.questionWidget.jqEl.fadeIn(100, function () {
                        if (that.answerWidget.getInputVal() === that.questionsManager.currentAnswer) {
                            setTimeout(function () {
                                that.propoundNewQuestion();
                            }, 100);
                        }
                    });
                });

                if (that.answerWidget.getInputVal() === that.getGoodAnswer()) {
                    that.answerWidget.displayGoodStyle();
                } else {
                    that.answerWidget.displayWrongStyle();
                }
                
            } else if (that.status === that.QUESTION_ANSWERED_STATUS) {
                that.propoundNewQuestion();
            }
        });

        this.answerWidget.jqEl.keydown(function (e) {
            if (e.which === 13) {
                that.questionWidget.click();
            }
        });
    };

    this.init = function () {
        this.setEvents();
        this.propoundNewQuestion();
    };
}

function QuestionWidget() {
    this.jqEl = $('#question');
    this.contentEl = this.jqEl.find('span');
    this.currentQuestion = '';
    this.minBoundary = 0;
    this.maxBoundary = 0;

    this.rand = function (pMin, pMax, pInteger) {
        if(pInteger)
            return Math.floor(((Math.random() * (pMax-pMin+1)) + pMin));		
        else
            return ((Math.random() * (pMax-pMin)) + pMin);
    };

    this.getParamInURL = function (pParam) {
        let vars = {};
      
        window.location.href
          .replace(location.hash, "")
          .replace(/[?&]+([^=&]+)=?([^&]*)?/gi, function(m, key, value) {
            vars[key] = value !== undefined ? value : "";
          });
      
        if (pParam) {
          return vars[pParam] ? vars[pParam] : 'nope';
        }
    };

    this.getBoundary = function (pParam, pDefaultValue) {
        let param = Number(this.getParamInURL(pParam));
    
        return ((Number.isNaN(param) || param < 0) ? pDefaultValue : param);
    };

    this.convertToLatex = function (pText) {
        return M(pText, true);
    };

    this.displayNewQuestion = function (pQuestion) {
        let that = this;
        this.hide(function () {
            that.setContent(pQuestion);
            that.show();
        });
    };

    this.click = () => this.jqEl.click();
    this.hide = (pCallback) => this.contentEl.hide(300, pCallback);
    this.show = () => this.contentEl.fadeIn(200);
    this.clearContent = () => this.contentEl.html('');
    this.setContent = function (ptextContent) {
        this.clearContent();
        this.contentEl.append(this.convertToLatex(ptextContent));
    };

    this.init = function () {
    };
}

function AnswerWidget() {
    this.jqEl = $('#answer');

    this.focus = () => this.jqEl.focus();
    this.clear = () => this.jqEl.val('');
    this.addClickEvent = this.jqEl.click;

    this.getInputVal = () => Number(this.jqEl.val());
    this.displayGoodStyle = function () {
        this.jqEl.css({'color': 'darkgrey', 'text-shadow': 'green 10px 0 20px'});
    };

    this.displayWrongStyle = function () {
        this.jqEl.css({'color': 'black', 'text-shadow': 'red 10px 0 20px'});
    };

    this.displayDefaultStyle = function () {
        this.jqEl.css({'color': 'black', 'text-shadow': 'none'});
    };

    this.init = function () {
        this.focus();
    }
}

function OptionPanel() {
    this.jqEl = $("#optionsPanel");
    this.closeOptionsPanelButton = $("#closeOptionsPanel")
    this.isVisible = false;
    this.parameters = ["squares", "cubes", "multiplications", "divisions", "modulos"];

    this.getParamInURL = function (pParam) {
        let vars = {};
      
        window.location.href
          .replace(location.hash, "")
          .replace(/[?&]+([^=&]+)=?([^&]*)?/gi, function(m, key, value) {
            vars[key] = value !== undefined ? value : "";
          });
      
        if (pParam) {
          return vars[pParam] ? vars[pParam] : 'nope';
        }
    };

    this.isUrlContainingNoOptions = function () {
        let ret = true;

        for (const param of this.parameters) {
            if (this.getParamInURL(param) !== 'nope') {
                ret = false;
                break;
            }
        }
    
        return (ret);
    };

    this.checkNCorrectUrl = function () {
        const urlParams = window.location.href.split('?')

        // If there are multiple "?" in the url or correct url but no options inside, we set default setttings
        if ((urlParams.length !== 2) || (this.isUrlContainingNoOptions())) {
            window.location.href = window.location.pathname + "?squares=1&squaresMin=0&squaresMax=50&cubes=1&cubesMin=0&cubesMax=50&multiplications=1&multiplicationsMin=0&multiplicationsMax=50&divisions=1&divisionsMin=0&divisionsMax=50&modulos=1&modulosMin=0&modulosMax=50";
        }
    };

    this.checkNCorrectBoundaries = function (pMinBoundary, pMaxBoundary) {
        pMinBoundary = parseInt(pMinBoundary);
        pMaxBoundary = parseInt(pMaxBoundary);

        if (isNaN(pMinBoundary) || pMinBoundary < 0 ) {
            pMinBoundary = 0;
        }

        if (isNaN(pMaxBoundary) || pMaxBoundary < 0 ) {
            pMaxBoundary = 50;
        }

        if (pMinBoundary > pMaxBoundary) {
            const swapper = pMinBoundary;

            pMinBoundary = pMaxBoundary;
            pMaxBoundary = swapper;
        }

        return [pMinBoundary, pMaxBoundary];
    };

    // called when the optionPanel shows up to update its content using get params
    this.updateOptionPanelContentBasedOnUrl = function () {
        let minBoundary = 0;
        let maxBoundary = 1;
        let tempBoundariesArray = [];

        for (const param of this.parameters) {
            if (this.getParamInURL(param) === "1") {
                $('#' + param + 'Option').prop('checked', true);

                tempBoundariesArray = this.checkNCorrectBoundaries(this.getParamInURL(param + 'Min'), this.getParamInURL(param + 'Max'));
                minBoundary = tempBoundariesArray[0];
                maxBoundary = tempBoundariesArray[1];

                $('#' + param + 'Min').val(minBoundary).prop('disabled', false);
                $('#' + param + 'Max').val(maxBoundary).prop('disabled', false);
            } else {
                $('#' + param + 'Min').prop('disabled', true);
                $('#' + param + 'Max').prop('disabled', true);
            }
        }
    };

    // called when the optionPanel hides down to update URL using optionPanel's content
    this.updateURLBasedOnOptionPanelContent = function () {
        let urlParams = '';
        let tempBoundariesArray = [];

        for (const param of this.parameters) {
            if($('#' + param + 'Option').prop('checked') === true) {
                urlParams += '&' + param + '=1';
                tempBoundariesArray = this.checkNCorrectBoundaries($('#' + param + 'Min').val(), $('#' + param + 'Max').val());
                urlParams += '&' + param + 'Min=' + tempBoundariesArray[0] + '&' + param + 'Max=' + tempBoundariesArray[1];

            }
        }

        window.location.href = window.location.pathname + "?" + urlParams;
    };

    this.show = function () {
        if(this.isVisible === false) {
            this.updateOptionPanelContentBasedOnUrl();
            this.jqEl.fadeIn(200);
            this.isVisible = true;
        }
    };
    
    this.hide = function() {
        if(this.isVisible === true) {
            this.jqEl.fadeOut(200);
            this.isVisible = false;
            this.updateURLBasedOnOptionPanelContent();
        }
    };
 
    this.setEvents = function() {
        this.closeOptionsPanelButton.on('click', () => {
            this.hide();
            $('#answer').focus();
        });

        for (const param of this.parameters) {
            $('#' + param + 'Option').change(function () {
                if (this.checked === true) {
                    $('#' + param + 'Min').prop('disabled', false);
                    $('#' + param + 'Max').prop('disabled', false);
                } else {
                    $('#' + param + 'Min').prop('disabled', true);
                    $('#' + param + 'Max').prop('disabled', true);
                }
            });
        }
    }

    this.init = function() {
        this.setEvents();
        this.checkNCorrectUrl();
    };
}

function QuestionsManager() {
    this.currentQuestion = '';
    this.currentAnswer = '';
    this.redactedAnswer = '';
    this.parameters = ["squares", "cubes", "multiplications", "divisions", "modulos"];

    this.rand = function (pMin, pMax, pInteger) {
        if(pInteger)
            return Math.floor(((Math.random() * (pMax-pMin+1)) + pMin));		
        else
            return ((Math.random() * (pMax-pMin)) + pMin);
    };

    this.getParamInURL = function (pParam) {
        let vars = {};
      
        window.location.href
          .replace(location.hash, "")
          .replace(/[?&]+([^=&]+)=?([^&]*)?/gi, function(m, key, value) {
            vars[key] = value !== undefined ? value : "";
          });
      
        if (pParam) {
          return vars[pParam] ? vars[pParam] : 'nope';
        }
    };

    this.checkNCorrectBoundaries = function (pMinBoundary, pMaxBoundary) {
        pMinBoundary = parseInt(pMinBoundary);
        pMaxBoundary = parseInt(pMaxBoundary);

        if (isNaN(pMinBoundary) || pMinBoundary < 0 ) {
            pMinBoundary = 0;
        }

        if (isNaN(pMaxBoundary) || pMaxBoundary < 0 ) {
            pMaxBoundary = 50;
        }

        if (pMinBoundary > pMaxBoundary) {
            const swapper = pMinBoundary;

            pMinBoundary = pMaxBoundary;
            pMaxBoundary = swapper;
        }

        return [pMinBoundary, pMaxBoundary];
    };

    this.getAllActivatedModes = function () {
        const listOptions = ['squares', 'cubes', 'multiplications', 'divisions', 'modulos'];
        let listActivatedOptions = [];

        for (const option of listOptions) {
            if (this.getParamInURL(option) === '1') {
                listActivatedOptions.push(option);
            }
        }

        return (listActivatedOptions);
    }

    this.generateQuestion = function () {
        const listActivatedModes = this.getAllActivatedModes();
        const pickedUpMode = listActivatedModes[this.rand(0, listActivatedModes.length - 1, true)];
        let retQuestion = '';

        switch (pickedUpMode) {
            case 'squares':
                    retQuestion = this.squaresGenerateQuestion();
                break;
            
            case 'cubes':
                retQuestion = this.cubesGenerateQuestion();
                break;
            

            case 'multiplications':
                retQuestion = this.multiplicationsGenerateQuestion();
                break;
    

            case 'divisions':
                retQuestion = this.divisionsGenerateQuestion();
                break;

                
            case 'modulos':
                retQuestion = this.modulosGenerateQuestion();
                break;
        }

        return retQuestion;
    }

    this.squaresGenerateQuestion = function () {

        let minBoundary = parseInt(this.getParamInURL('squaresMin'));
        let maxBoundary = parseInt(this.getParamInURL('squaresMax'));

        [minBoundary, maxBoundary] = this.checkNCorrectBoundaries(minBoundary, maxBoundary);

        const generatedNumber = this.rand(minBoundary, maxBoundary, true);
        this.currentQuestion = generatedNumber + "^2 = ?";
        this.currentAnswer = generatedNumber * generatedNumber;
        this.redactedAnswer = generatedNumber + "^2 = " + this.currentAnswer;

        return this.currentQuestion;
    }

    this.cubesGenerateQuestion = function () {
        let minBoundary = parseInt(this.getParamInURL('cubesMin'));
        let maxBoundary = parseInt(this.getParamInURL('cubesMax'));

        [minBoundary, maxBoundary] = this.checkNCorrectBoundaries(minBoundary, maxBoundary);

        const generatedNumber = this.rand(minBoundary, maxBoundary, true);
        this.currentQuestion = generatedNumber + "^3 = ?";
        this.currentAnswer = generatedNumber * generatedNumber * generatedNumber;
        this.redactedAnswer = generatedNumber + "^3 = " + this.currentAnswer;

        return this.currentQuestion;
    }

    this.multiplicationsGenerateQuestion = function () {
        let minBoundary = parseInt(this.getParamInURL('multiplicationsMin'));
        let maxBoundary = parseInt(this.getParamInURL('multiplicationsMax'));

        [minBoundary, maxBoundary] = this.checkNCorrectBoundaries(minBoundary, maxBoundary);

        const generatedNumber = this.rand(minBoundary, maxBoundary, true);
        const secondNumber = this.rand(0, 10, true);
        this.currentQuestion = generatedNumber + " × " + secondNumber + " = ?";
        this.currentAnswer = generatedNumber * secondNumber;
        this.redactedAnswer = generatedNumber + " × " + secondNumber + " = " + this.currentAnswer;

        return this.currentQuestion;
    }

    this.divisionsGenerateQuestion = function () {
        let minBoundary = parseInt(this.getParamInURL('divisionsMin'));
        let maxBoundary = parseInt(this.getParamInURL('divisionsMax'));

        [minBoundary, maxBoundary] = this.checkNCorrectBoundaries(minBoundary, maxBoundary);

        const tableNumber = this.rand(minBoundary, maxBoundary, true);
        const singleNumber = this.rand(1, 10, true);
        const productNumber = tableNumber * singleNumber;
        const headOrTail = this.rand(0, 1, true);

        if (headOrTail === 0) {
            this.currentQuestion = productNumber + " / " + singleNumber + " = ?";
            this.currentAnswer = productNumber / singleNumber;
            this.redactedAnswer = productNumber + " / " + singleNumber + " = " + this.currentAnswer;
        } else {
            this.currentQuestion = productNumber + " / " + tableNumber + " = ?";
            this.currentAnswer = productNumber / tableNumber;
            this.redactedAnswer = productNumber + " / " + tableNumber + " = " + this.currentAnswer;
        }

        return this.currentQuestion;
    }

    this.modulosGenerateQuestion = function () {
        let minBoundary = parseInt(this.getParamInURL('modulosMin'));
        let maxBoundary = parseInt(this.getParamInURL('modulosMax'));

        [minBoundary, maxBoundary] = this.checkNCorrectBoundaries(minBoundary, maxBoundary);

        const generatedNumber = this.rand(minBoundary, maxBoundary, true);
        const secondNumber = this.rand(1, 10, true);
        this.currentQuestion = generatedNumber + " % " + secondNumber + " = ?";
        this.currentAnswer = generatedNumber % secondNumber;
        this.redactedAnswer = generatedNumber + " % " + secondNumber + " = " + this.currentAnswer;

        return this.currentQuestion;
    };
}

$(function () {
    let questionWidget = new QuestionWidget();
    let answerWidget = new AnswerWidget();
    let optionPanel = new OptionPanel();
    let controller = new Controller(questionWidget, answerWidget);

    questionWidget.init();
    answerWidget.init();
    optionPanel.init();
    controller.init();

    $('#optionsButton').on('click', () => optionPanel.show());
    $('body').on('keydown', (e) => {
        if(e.which === 27) {
            e.preventDefault();
            $('#closeOptionsPanel').click();
        }
    })
});

