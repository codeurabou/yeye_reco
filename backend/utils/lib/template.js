const template = {
    bonAchat({ frs, provider, datas, achat, sum }) {
        return ` <html>
            <head>
                <title>Test PDF</title>
                <style>
                    *{
                        margin:0px;
                        padding:0px;
                    }
                    body {
                        font-family: "Hevletica Neue", "Helvetica", "Arial", sans-serif;
                        font-size: 16px;
                        line-height: 24px;
                    }
                    
                    #pdf {
                        display:flex;
                        flex-direction:column;
                        justify-content:space-between;
                        padding:25px;
                    }
                    #pdf-header-top {
                        display:flex;
                        align-items:center;
                        justify-content:space-between;
                        margin:5px;
                    }
                    #pdf-header-bottom {
                        display:flex;
                        align-items:center;
                        justify-content:space-between;
                        margin-top:15px;
                    }
                    #divider{
                        border: 2px solid gray;
                        margin:5px;
                        outline:none;
                    }


                    #pdf-main{
                        margin-top:15%;
                    }

                    table{
                        margin:5px;
                    }
                    
                    table>thead>tr>th{
                        padding:6px;
                        background-color:blue;
                        color:white;
                    }
                    table>tbody>tr>td{
                        text-align:center;
                        padding:12px;
                        word-wrap:break-word;
                    }

                    #pdf-main-bottom {
                        margin-top:5%;
                    }

                    #pdf-main-bottom-text {
                        position:absolute;
                        right:0;
                        margin:15px;
                    }
                
                </style>
            </head>
            <body>
               <div id="pdf">
                 <header id="pdf-header">
                    <div id="pdf-header-top">
                        <img src="" alt="le logo de la societe"></img>
                    </div>
                    <div id="pdf-header-bottom">
                       <div>
                            <h3>${provider.bo_nom || ""}</h3>
                            <p>Telephone : ${provider.bo_tel || ""}</p>
                            <p>Email : ${provider.bo_email || ""}</p>
                            <p>Addresse : ${provider.bo_adr || ""}</p>
                       </div>
                       <div>
                            <p>Commande N° : random number</p>
                            <p>Fournisseur : ${frs.fo_nom || ""}</p>
                            <p>Addresse : ${frs.fo_adr || ""}</p>
                            <p>Telephone : ${frs.fo_tel || ""}</p>
                            <p>Email : ${frs.fo_email || ""}</p>
                       </div>
                    </div>
                    <hr id="divider"/>
                 </header>
                 <main id="pdf-main">
                   <div id="pdf-main-top">
                        <h2>Bon de commande</h2>
                        <p>Informations de l'achats</p>
                        <table>
                            <thead>
                                <tr>
                                    <th>Date de Reception</th>
                                    <th>Motif</th>
                                    <th>Date de la commande</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <td>${new Date(
            achat.ac_date
        ).toLocaleDateString() || ""
            }</td>
                                    <td>${achat.ac_desc || ""}</td>
                                    <td>${new Date(
                achat.createdAt
            ).toLocaleString() || ""
            }</td>
                                </tr>
                            </tbody>
                        </table>
                   </div>
                   <div id="pdf-main-bottom">
                        <p>Liste des produits commandés</p>
                        <table>
                            <thead>
                                <tr>
                                    <th>Nom</th>
                                    <th>Unite</th>
                                    <th>Qte</th>
                                    <th>Prix</th>
                                    <th>Montant</th>
                                </tr>
                            </thead>
                            <tbody>
                                ${datas}
                            </tbody>
                      </table>
                      <div id="pdf-main-bottom-text">
                        <p>Somme totals : ${sum}</p>
                      </div>
                   </div>
                 </main>
               </div>
            </body>
        </html>`
    },
    facturePro({ clt, provider, datas, vendre, sum }) {
        return `
        <!DOCTYPE html>
        <html lang="fr">
        <head>
            <title>Facture Proforma</title>
            <style>
                * {
                    margin: 0px;
                    padding: 0px;
                }
        
                body{
                    
                }

                #facture {
                   
                }
        
                #facture-header>div {
                    margin: 15px
                }
        
                #facture-header-text {
                    display: flex;
                    align-items: center;
                    justify-content: space-between;
                }
        
                #divider {
                    border: 4px solid lightblue;
                    border-radius: 12px;
                    margin: 10px;
                }
        
                #facture-content-top>p {
                    margin: 5px;
                }
        
                table {
                    width: 100%;
                    /* background-color: lightblue; */
                }
        
                table>thead>tr>th {
                    background-color: lightblue;
                    color: white;
                    padding: 12px;
                }
        
                table>tbody>tr>td {
                    margin: 5px;
                    padding: 22px;
                    text-align: center;
                    font-family: monospace;
                    font-weight: bold;
                    font-size: 15px;
                }
                #facture-calc {
                    position: absolute;
                    right: 0;
                    margin: 22px;
                }
            </style>
        </head>
        
        <body>
            <div id="facture">
                <header id="facture-header">
                    <div>
                        <img src="" alt="logo_entreprise">
                    </div>
                    <div id="facture-header-text">
                        <div>
                            <h1>Mon Entreprise</h1>
                            <h3>Barry Informatique</h3>
                            <p>Telephone : 94865879</p>
                            <p>Addresse : Lafiabougou</p>
                            <p>Email : bs@gmail.com</p>
                        </div>
                        <div>
                            <h1>Client</h1>
                            <h3>Aboubacar Barry</h3>
                            <p>Telephone : 00223 73535261</p>
                            <p>Adresse : Lafiabougou</p>
                        </div>
                    </div>
                </header>
                <hr id="divider" />
                <main id="facture-content">
                    <div id="facture-content-top">
                        <h3>Facture Pro Format N° : </h3>
                        <p>Date : </p>
                        <p>Date de la vente : </p>
                        <p>Adresse de livraison : </p>
                    </div>
                    <div id="facture-content-bottom">
                        <table>
                            <thead>
                                <tr>
                                    <th>Designation</th>
                                    <th>Quantité</th>
                                    <th>Prix</th>
                                    <th>Montant</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <td>Ihpone 12 Pro Max</td>
                                    <td>12</td>
                                    <td>123000</td>
                                    <td>900000</td>
                                </tr>
                            </tbody>
                        </table>
                        <div id="facture-calc">
                            <p>Somme : 0000000000000 FCFA </p>
                        </div>
                    </div>
                </main>
                <footer id="facture-footer">
                    <p>Merci !!</p>
                </footer>
            </div>
        </body>
        </html>
        `
    }
}

module.exports = template
