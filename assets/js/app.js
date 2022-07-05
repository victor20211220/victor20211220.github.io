var playersTable, items;
$('#searchPlayersInput').keyup(function () { //search players
    playersTable.search($(this).val()).draw();
})
$(document).ready(function () {
    $.getJSON("/challengeriftmonk_snap.json", function (data) { //render json
        items = data.items;
        let serverListHtml = "";
        const serverNames = [];
        const itemRows = [];
        if (items.length) {
            items.forEach((item, index) => {
                const serverName = item.Server;
                if (serverNames.indexOf(serverName) === -1) {
                    serverNames.push(serverName);
                    serverListHtml += `<li><a class="dropdown-item" href="javascript:void(0)">${serverName}</a></li>`;
                }

                itemRows.push(`
                <tr>
                <td>${index + 1}<span class="d-none">${serverName}</span></td>
                <td
                ><img alt="" src="/assets/user.png"/>
                <span>${item.Profile}</span>
                </td>
                <td>${item.Class}</td>
                <td>${item.Rift}</td>
                <td>${item.Time}</td>
                </tr>
                `);
            })
        }
        $(serverListHtml).appendTo("#serverList");
        $(itemRows.join("")).appendTo("tbody");
        playersTable = $('#playersTable').DataTable({
            ordering: false,
            language: {
                sLengthMenu: "_MENU_"
            },
            "columns": [
                {"width": "5%"},
                {"width": "65%"},
                {"width": "10%"},
                {"width": "10%"},
                {"width": "10%"},
            ]
        });
        //jQuery("#playersTable_length").detach().appendTo('#filters .container');
    });
});
$(document).on('click', '#serverList a', function () {
    const selectedServerName = $(this).text();
    $(".btn:first-child").text(selectedServerName);
    playersTable
        .columns(0)
        .search(selectedServerName === "All Servers" ? "" : selectedServerName)
        .draw();
})