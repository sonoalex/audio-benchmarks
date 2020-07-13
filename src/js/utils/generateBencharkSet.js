import data from '../data/data';

export default () => {

    let mainContainer = document.getElementById("main-container");

    data.forEach(element => {
        let h3 = document.createElement('h3');
        h3.textContent = element.title;
        h3.classList.add('title');
        mainContainer.appendChild(h3);

        mainContainer
            .appendChild(
                createNotificationBlocks(element)
                );
    });

    function createNotificationBlocks(element) {
        let mainDiv = document.createElement('div');
        mainDiv.classList.add('container');
        
        element.childs.forEach(childEl => {

            let notiDiv = document.createElement('div');
            notiDiv.className = "notification";
            notiDiv.setAttribute("id", childEl.id);

            // Append Algorithm title
            let h4 = document.createElement('h4');
            h4.textContent = childEl.title;
            h4.classList.add('subtitle');
            
            notiDiv.appendChild(h4);
            notiDiv.innerHTML += createColumnsBlock();
            // Finally append it to the mainDiv container
            mainDiv.appendChild(notiDiv);
            
        });
        
        return mainDiv;
    }

    function createColumnsBlock() {
        let template = `
        <div class="columns is-mobile is-centered">
            <div class="column">
                <div class="buttons">
                    <button id="start_offline" class="button is-primary">Offline</button>
                </div>
                <p id="results"></p>
                <a id="download_results" class="is-hidden"></a>
            </div>
            <div class="column" id="essentia_results">
                <h4 class="subtitle is-4">essentia.js results</h4>
                <div id="table"></div>
                <div id="plot"></div>
                <div id="plot_stack"></div>
            </div>
            <div class="column" id="meyda_results">
                <h4 class="subtitle is-4">meyda results</h4>
                <div id="table"></div>
                <div id="plot"></div>
            </div>
        </div>
        `;

        return template;
    }
};

