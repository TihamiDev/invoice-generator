document.addEventListener("DOMContentLoaded", () => {

    const productTableBody =
        document.getElementById("productTableBody");

    const addProductBtn =
        document.getElementById("addProductBtn");

    const generateInvoiceBtn =
        document.getElementById("generateInvoiceBtn");

    const editCustomerBtn =
        document.getElementById("editCustomerBtn");


    // -----------------------------------------
    // DEFAULT DATE
    // -----------------------------------------

    const invoiceDate =
        document.getElementById("invoiceDate");

    const today = new Date();

    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, "0");
    const day = String(today.getDate()).padStart(2, "0");

    invoiceDate.value = `${year}-${month}-${day}`;


    // -----------------------------------------
    // CUSTOMER EDIT
    // -----------------------------------------

    editCustomerBtn.addEventListener("click", () => {

        const fields = [
            document.getElementById("customerName"),
            document.getElementById("customerGSTIN"),
            document.getElementById("customerAddress")
        ];

        const currentlyReadonly =
            fields[0].hasAttribute("readonly");


        fields.forEach(field => {

            if (currentlyReadonly) {
                field.removeAttribute("readonly");
            } else {
                field.setAttribute("readonly", true);
            }

        });


        editCustomerBtn.textContent =
            currentlyReadonly ? "Save" : "Edit";

    });


    // -----------------------------------------
    // CURRENCY
    // -----------------------------------------

    function currency(value) {

        return "₹" + value.toFixed(2);

    }


    // -----------------------------------------
    // CALCULATE ROW
    // -----------------------------------------

    function calculateRow(row) {

        const quantity =
            parseFloat(
                row.querySelector(".quantity").value
            ) || 0;


        const price =
            parseFloat(
                row.querySelector(".price").value
            ) || 0;


        const tax =
            parseFloat(
                row.querySelector(".product-tax").value
            );


        const amount =
            quantity * price;


        row.querySelector(".amount").textContent =
            currency(amount);


        return {
            amount,
            tax
        };

    }


    // -----------------------------------------
    // CALCULATE ALL PRODUCTS
    // -----------------------------------------

    function calculateTotals() {

        const rows =
            productTableBody.querySelectorAll(".product-row");


        let subtotal = 0;

        let taxable5 = 0;
        let taxable18 = 0;


        // -------------------------------------
        // SEPARATE PRODUCTS BY TAX SLAB
        // -------------------------------------

        rows.forEach(row => {

            const result =
                calculateRow(row);


            subtotal += result.amount;


            if (result.tax === 5) {

                taxable5 += result.amount;

            }


            if (result.tax === 18) {

                taxable18 += result.amount;

            }

        });


        // -------------------------------------
        // 5% GST
        // SGST = 2.5%
        // CGST = 2.5%
        // -------------------------------------

        const sgst5 =
            taxable5 * 0.025;

        const cgst5 =
            taxable5 * 0.025;


        // -------------------------------------
        // 18% GST
        // SGST = 9%
        // CGST = 9%
        // -------------------------------------

        const sgst18 =
            taxable18 * 0.09;

        const cgst18 =
            taxable18 * 0.09;


        // -------------------------------------
        // TOTAL TAX
        // -------------------------------------

        const totalTax =
            sgst5 +
            cgst5 +
            sgst18 +
            cgst18;


        // -------------------------------------
        // GRAND TOTAL
        // -------------------------------------

        const grandTotal =
            subtotal + totalTax;


        // -------------------------------------
        // UPDATE SCREEN
        // -------------------------------------

        document.getElementById("subtotal")
            .textContent = currency(subtotal);


        document.getElementById("sgst5")
            .textContent = currency(sgst5);


        document.getElementById("cgst5")
            .textContent = currency(cgst5);


        document.getElementById("sgst18")
            .textContent = currency(sgst18);


        document.getElementById("cgst18")
            .textContent = currency(cgst18);


        document.getElementById("totalTax")
            .textContent = currency(totalTax);


        document.getElementById("grandTotal")
            .textContent = currency(grandTotal);


        return {
            subtotal,
            taxable5,
            taxable18,
            sgst5,
            cgst5,
            sgst18,
            cgst18,
            totalTax,
            grandTotal
        };

    }


    // -----------------------------------------
    // ADD PRODUCT
    // -----------------------------------------

    addProductBtn.addEventListener("click", () => {

        const row =
            document.createElement("tr");

        row.className = "product-row";


        row.innerHTML = `

            <td class="serial"></td>

            <td>
                <input
                    type="text"
                    class="product-name"
                    placeholder="Product name"
                >
            </td>

            <td>
                <input
                    type="text"
                    class="product-code"
                    placeholder="Code"
                >
            </td>

            <td>
                <input
                    type="text"
                    class="hsn-code"
                    value="42022"
                    readonly
                >
            </td>

            <td>
                <input
                    type="number"
                    class="quantity"
                    min="1"
                    value="1"
                >
            </td>

            <td>
                <input
                    type="text"
                    class="unit"
                    value="pcs"
                    readonly
                >
            </td>

            <td>
                <input
                    type="number"
                    class="price"
                    min="0"
                    step="0.01"
                    placeholder="0.00"
                >
            </td>

            <td>

                <select class="product-tax">

                    <option value="5">5%</option>

                    <option value="18">18%</option>

                </select>

            </td>

            <td class="amount">
                ₹0.00
            </td>

            <td>

                <button
                    type="button"
                    class="remove-product"
                    title="Remove product"
                >
                    ×
                </button>

            </td>

        `;


        productTableBody.appendChild(row);


        attachRowEvents(row);

        updateSerialNumbers();

        calculateTotals();

    });


    // -----------------------------------------
    // REMOVE PRODUCT
    // -----------------------------------------

    productTableBody.addEventListener("click", event => {

        if (
            event.target.classList.contains(
                "remove-product"
            )
        ) {

            const rows =
                productTableBody.querySelectorAll(
                    ".product-row"
                );


            if (rows.length === 1) {

                alert(
                    "At least one product is required."
                );

                return;

            }


            event.target
                .closest(".product-row")
                .remove();


            updateSerialNumbers();

            calculateTotals();

        }

    });


    // -----------------------------------------
    // SERIAL NUMBERS
    // -----------------------------------------

    function updateSerialNumbers() {

        const rows =
            productTableBody.querySelectorAll(
                ".product-row"
            );


        rows.forEach((row, index) => {

            row.querySelector(".serial")
                .textContent = `${index + 1}.`;

        });

    }


    // -----------------------------------------
    // INPUT EVENTS
    // -----------------------------------------

    function attachRowEvents(row) {

        row.querySelectorAll("input").forEach(input => {

            input.addEventListener(
                "input",
                calculateTotals
            );

        });


        row.querySelector(".product-tax")
            .addEventListener(
                "change",
                calculateTotals
            );

    }


    // -----------------------------------------
    // GENERATE
    // -----------------------------------------

    generateInvoiceBtn.addEventListener("click", () => {

        calculateTotals();

        generateInvoicePDF();

    });


    // -----------------------------------------
    // INITIALIZE
    // -----------------------------------------

    const firstRow =
        productTableBody.querySelector(".product-row");


    attachRowEvents(firstRow);

    updateSerialNumbers();

    calculateTotals();


    // =========================================================
    // FONT LOADING
    // ---------------------------------------------------------
    // jsPDF's built-in "helvetica" font has no ₹ (Rupee) glyph,
    // which is why the amount was rendering as a garbled/
    // overlapping character. Noto Sans does contain it, so we
    // fetch it once (cached across multiple "Generate Invoice"
    // clicks) and register it with jsPDF as a custom font.
    // =========================================================

    let notoFontFilesPromise = null;

    function loadNotoFontFiles() {

        if (!notoFontFilesPromise) {

            const base =
                "https://raw.githubusercontent.com/googlefonts/noto-fonts/main/hinted/ttf/NotoSans/";

            const files = {
                normal: "NotoSans-Regular.ttf",
                bold: "NotoSans-Bold.ttf",
                italic: "NotoSans-Italic.ttf",
                bolditalic: "NotoSans-BoldItalic.ttf"
            };

            async function fetchAsBase64(fileName) {

                const response = await fetch(base + fileName);

                if (!response.ok) {
                    throw new Error(
                        `Could not load font file: ${fileName}`
                    );
                }

                const buffer =
                    await response.arrayBuffer();

                const bytes =
                    new Uint8Array(buffer);

                let binary = "";

                const chunkSize = 0x8000;

                for (let i = 0; i < bytes.length; i += chunkSize) {

                    binary += String.fromCharCode.apply(
                        null,
                        bytes.subarray(i, i + chunkSize)
                    );

                }

                return btoa(binary);

            }

            notoFontFilesPromise = Promise.all([
                fetchAsBase64(files.normal),
                fetchAsBase64(files.bold),
                fetchAsBase64(files.italic),
                fetchAsBase64(files.bolditalic)
            ]).then(([normal, bold, italic, bolditalic]) => ({
                normal,
                bold,
                italic,
                bolditalic
            }));

        }

        return notoFontFilesPromise;

    }

    async function registerInvoiceFont(doc) {

        const fonts =
            await loadNotoFontFiles();

        doc.addFileToVFS("NotoSans-Regular.ttf", fonts.normal);
        doc.addFont("NotoSans-Regular.ttf", "NotoSans", "normal");

        doc.addFileToVFS("NotoSans-Bold.ttf", fonts.bold);
        doc.addFont("NotoSans-Bold.ttf", "NotoSans", "bold");

        doc.addFileToVFS("NotoSans-Italic.ttf", fonts.italic);
        doc.addFont("NotoSans-Italic.ttf", "NotoSans", "italic");

        doc.addFileToVFS("NotoSans-BoldItalic.ttf", fonts.bolditalic);
        doc.addFont("NotoSans-BoldItalic.ttf", "NotoSans", "bolditalic");

    }


    // -----------------------------------------
    // NUMBER TO WORDS
    // -----------------------------------------

    function numberToWords(number) {

        const ones = [
            "", "One", "Two", "Three", "Four", "Five", "Six", "Seven",
            "Eight", "Nine", "Ten", "Eleven", "Twelve", "Thirteen",
            "Fourteen", "Fifteen", "Sixteen", "Seventeen", "Eighteen",
            "Nineteen"
        ];

        const tens = [
            "", "", "Twenty", "Thirty", "Forty", "Fifty", "Sixty",
            "Seventy", "Eighty", "Ninety"
        ];


        function convert(n) {

            if (n < 20) {
                return ones[n];
            }


            if (n < 100) {

                return tens[Math.floor(n / 10)] +
                    (n % 10 !== 0
                        ? " " + ones[n % 10]
                        : "");

            }


            if (n < 1000) {

                return ones[Math.floor(n / 100)] +
                    " Hundred" +
                    (n % 100 !== 0
                        ? " " + convert(n % 100)
                        : "");

            }


            if (n < 100000) {

                return convert(Math.floor(n / 1000)) +
                    " Thousand" +
                    (n % 1000 !== 0
                        ? " " + convert(n % 1000)
                        : "");

            }


            if (n < 10000000) {

                return convert(Math.floor(n / 100000)) +
                    " Lakh" +
                    (n % 100000 !== 0
                        ? " " + convert(n % 100000)
                        : "");

            }


            return convert(Math.floor(n / 10000000)) +
                " Crore" +
                (n % 10000000 !== 0
                    ? " " + convert(n % 10000000)
                    : "");

        }


        if (number === 0) {
            return "Zero";
        }


        return convert(number);

    }


    // =========================================================
    // GENERATE INVOICE PDF
    // ---------------------------------------------------------
    // Layout, column widths and row heights below were measured
    // directly off the reference invoice template (the DOCX /
    // PDF samples) so the output matches that template as
    // closely as possible, while still adapting cleanly to any
    // number of product rows.
    // =========================================================

    async function generateInvoicePDF() {

        if (!window.jspdf) {
            alert("PDF library load nahi hui. Please refresh the page.");
            return;
        }

        const { jsPDF } = window.jspdf;

        const doc = new jsPDF({
            orientation: "portrait",
            unit: "mm",
            format: "a4"
        });

        try {
            await registerInvoiceFont(doc);
        } catch (err) {
            console.error(err);
            alert("Could not load the invoice font. Please check your internet connection and try again.");
            return;
        }


        // =====================================================
        // TEXT HELPERS
        // =====================================================

        function setFont(style) {
            doc.setFont("NotoSans", style);
        }

        function text(value, x, y, size = 8, style = "normal", align = "left") {
            setFont(style);
            doc.setFontSize(size);
            doc.text(String(value), x, y, { align });
        }

        function textBlock(lines, x, y, size, style, align, lineHeight) {
            setFont(style);
            doc.setFontSize(size);
            lines.forEach((line, i) => {
                doc.text(line, x, y + i * lineHeight, { align });
            });
        }

        function underlineCentered(cx, y, str, size, style) {
            setFont(style);
            doc.setFontSize(size);
            const w = doc.getTextWidth(str);
            doc.setLineWidth(0.2);
            doc.line(cx - w / 2, y + 0.8, cx + w / 2, y + 0.8);
        }

        function underlineLeft(x, y, str, size, style) {
            setFont(style);
            doc.setFontSize(size);
            const w = doc.getTextWidth(str);
            doc.setLineWidth(0.2);
            doc.line(x, y + 0.8, x + w, y + 0.8);
        }

        function hLine(x1, x2, y, w = 0.25) {
            doc.setLineWidth(w);
            doc.line(x1, y, x2, y);
        }

        function vLine(x, y1, y2, w = 0.25) {
            doc.setLineWidth(w);
            doc.line(x, y1, x, y2);
        }


        // =====================================================
        // BASIC DATA
        // =====================================================

        const invoiceNumber =
            document.getElementById("invoiceNumber").value.trim();

        const dateValue =
            document.getElementById("invoiceDate").value;

        const customerName =
            document.getElementById("customerName").value.trim();

        const customerGSTIN =
            document.getElementById("customerGSTIN").value.trim();

        const customerAddress =
            document.getElementById("customerAddress").value.trim();


        let invoiceDateStr = "";

        if (dateValue) {
            const parts = dateValue.split("-");
            invoiceDateStr = `${parts[2]}-${parts[1]}-${parts[0]}`;
        }


        // =====================================================
        // SELLER
        // =====================================================

        const sellerName = "A.R Creation";

        const sellerAddress =
            "First Floor, 774/2, F Prem Nagar Qila Kadam Sarif, Nabi Karim, Central Delhi, Delhi, 110055";

        const sellerGSTIN =
            "07CZMPA8812R1ZP";


        // =====================================================
        // PRODUCTS
        // =====================================================

        const rows = document.querySelectorAll(".product-row");

        const products = [];

        rows.forEach((row, index) => {

            const name =
                row.querySelector(".product-name").value.trim();

            const code =
                row.querySelector(".product-code").value.trim();

            const hsn =
                row.querySelector(".hsn-code").value.trim();

            const quantity =
                parseFloat(row.querySelector(".quantity").value) || 0;

            const unit =
                row.querySelector(".unit").value.trim() || "pcs";

            const price =
                parseFloat(row.querySelector(".price").value) || 0;

            const tax =
                parseFloat(row.querySelector(".product-tax").value) || 5;

            const amount = quantity * price;

            products.push({
                serial: index + 1,
                name,
                code,
                hsn,
                quantity,
                unit,
                price,
                tax,
                amount
            });
        });


        // =====================================================
        // TAX CALCULATION
        // =====================================================

        let subtotal = 0;
        let taxable5 = 0;
        let taxable18 = 0;

        products.forEach(product => {

            subtotal += product.amount;

            if (product.tax === 5) {
                taxable5 += product.amount;
            }

            if (product.tax === 18) {
                taxable18 += product.amount;
            }
        });

        const sgst5 = taxable5 * 0.025;
        const cgst5 = taxable5 * 0.025;

        const sgst18 = taxable18 * 0.09;
        const cgst18 = taxable18 * 0.09;

        const totalTax =
            sgst5 +
            cgst5 +
            sgst18 +
            cgst18;

        const grandTotal =
            subtotal + totalTax;


        // =====================================================
        // LAYOUT CONSTANTS
        // =====================================================

        const left = 10;
        const right = 200;
        const width = right - left;
        const top = 10;
        const midX = left + width / 2; // 105


        // Product table column boundaries
        const colW = {
            sn: 9.8, desc: 80.2, hsn: 17.4,
            qty: 17.6, unit: 13.6, price: 23.2, amount: 28.2
        };

        const xSN = left;
        const xDesc = xSN + colW.sn;
        const xHsn = xDesc + colW.desc;
        const xQty = xHsn + colW.hsn;
        const xUnit = xQty + colW.qty;
        const xPrice = xUnit + colW.unit;
        const xAmount = xPrice + colW.price;   // Price / Amount divider
        const xEnd = xAmount + colW.amount;    // = right


        // Row heights (mm) - measured off the reference template
        const headerH = 28;
        const infoH = 21;
        const billShipH = 38.95;
        const prodHeaderH = 12.5;
        const minProdBodyH = 66.68;
        const rowLineH = 6;
        const addLineH = 6.2;
        const grandTotalH = 8.46;
        const taxHeaderH = 5.5;
        const taxRowH = 5.3;
        const wordsH = 8.36;
        const receiverH = 12.17;
        const forArH = 20.11;
        const taxTableW = 160;


        const numTaxLines =
            1 + (taxable18 > 0 ? 2 : 0) + (taxable5 > 0 ? 2 : 0);

        const numTaxSlabs =
            (taxable5 > 0 ? 1 : 0) + (taxable18 > 0 ? 1 : 0);

        const prodBodyH =
            Math.max(minProdBodyH, products.length * rowLineH + 8);

        const addRowH =
            numTaxLines * addLineH + 4;


        // =====================================================
        // Y BOUNDARIES
        // =====================================================

        const yTop = top;
        const yHeaderBot = yTop + headerH;
        const yInfoBot = yHeaderBot + infoH;
        const yBillBot = yInfoBot + billShipH;
        const yProdHeaderBot = yBillBot + prodHeaderH;
        const yProdBodyBot = yProdHeaderBot + prodBodyH;
        const yAddBot = yProdBodyBot + addRowH;
        const yGrandBot = yAddBot + grandTotalH;
        const yTaxHeaderBot = yGrandBot + taxHeaderH;
        const yTaxRowsBot = yTaxHeaderBot + numTaxSlabs * taxRowH;
        const yWordsBot = yTaxRowsBot + wordsH;
        const yReceiverBot = yWordsBot + receiverH;
        const yForArBot = yReceiverBot + forArH;


        // =====================================================
        // OUTER BOX
        // =====================================================

        doc.setLineWidth(0.4);
        doc.rect(left, yTop, width, yForArBot - yTop);


        // =====================================================
        // HEADER
        // =====================================================

        text(`GSTIN:   ${sellerGSTIN}`, left + 2, yTop + 5, 8, "bold");
        text("Original Copy", right - 2, yTop + 5, 8, "italic", "right");

        text("TAX INVOICE", midX, yTop + 11.5, 13, "bold", "center");
        underlineCentered(midX, yTop + 11.5, "TAX INVOICE", 13, "bold");

        text(sellerName, midX, yTop + 18, 13, "bold", "center");

        const sellerAddrLines = doc.splitTextToSize(sellerAddress, 132);
        setFont("normal");
        doc.setFontSize(7);
        doc.text(sellerAddrLines, midX, yTop + 21.5, {
            align: "center",
            lineHeightFactor: 1.2
        });

        hLine(left, right, yHeaderBot);


        // =====================================================
        // INVOICE INFORMATION
        // =====================================================

        vLine(midX, yHeaderBot, yBillBot);

        const infoLabelX = left + 2;
        const infoColonX = left + 32;
        const infoLineY = yHeaderBot + 5;
        const infoLineGap = 4.3;

        text("Invoice No.", infoLabelX, infoLineY, 7.5, "normal");
        text(`: ${invoiceNumber}`, infoColonX, infoLineY, 7.5, "normal");

        text("Date of Invoice", infoLabelX, infoLineY + infoLineGap, 7.5, "normal");
        text(`: ${invoiceDateStr}`, infoColonX, infoLineY + infoLineGap, 7.5, "normal");

        text("Place of Supply", infoLabelX, infoLineY + infoLineGap * 2, 7.5, "normal");
        text(": Delhi (07)", infoColonX, infoLineY + infoLineGap * 2, 7.5, "normal");

        text("Reverse Charge", infoLabelX, infoLineY + infoLineGap * 3, 7.5, "normal");
        text(": N", infoColonX, infoLineY + infoLineGap * 3, 7.5, "normal");

        const infoRightX = midX + 5;
        text(":", infoRightX, infoLineY, 7.5, "normal");
        text(": TRANSPORT", infoRightX, infoLineY + infoLineGap, 7.5, "normal");
        text(":", infoRightX, infoLineY + infoLineGap * 2, 7.5, "normal");
        text(": DELHI", infoRightX, infoLineY + infoLineGap * 3, 7.5, "normal");

        hLine(left, right, yInfoBot);


        // =====================================================
        // BILLED TO / SHIPPED TO
        // =====================================================

        const custAddrLines =
            doc.splitTextToSize(customerAddress, midX - left - 4);

        text("Billed to     :", left + 2, yInfoBot + 5, 7.5, "bolditalic");
        underlineLeft(left + 2, yInfoBot + 5, "Billed to", 7.5, "bolditalic");
        text(customerName, left + 2, yInfoBot + 9.8, 7.5, "bold");
        textBlock(custAddrLines, left + 2, yInfoBot + 14.2, 7, "normal", "left", 3.7);

        const custAddrBot =
            yInfoBot + 14.2 + custAddrLines.length * 3.7;

        text(`GSTIN/UIN: ${customerGSTIN}`, left + 2, custAddrBot + 2.5, 7, "bold");

        text("Shipped to:", midX + 2, yInfoBot + 5, 7.5, "bolditalic");
        underlineLeft(midX + 2, yInfoBot + 5, "Shipped to", 7.5, "bolditalic");
        text(customerName, midX + 2, yInfoBot + 9.8, 7.5, "bold");
        textBlock(custAddrLines, midX + 2, yInfoBot + 14.2, 7, "normal", "left", 3.7);
        text(`GSTIN/UIN: ${customerGSTIN}`, midX + 2, custAddrBot + 2.5, 7, "bold");

        hLine(left, right, yBillBot);


        // =====================================================
        // PRODUCT TABLE
        // =====================================================

        [xSN, xDesc, xHsn, xQty, xUnit, xPrice, xAmount, xEnd].forEach(x => {
            vLine(x, yBillBot, yProdBodyBot);
        });

        hLine(left, right, yProdHeaderBot);

        const headerMidY = yBillBot + prodHeaderH / 2;

        text("S.N.", (xSN + xDesc) / 2, headerMidY + 1.5, 7.5, "bold", "center");
        text("Description of Goods", (xDesc + xHsn) / 2, headerMidY + 1.5, 7.5, "bold", "center");
        text("HSN/SAC", (xHsn + xQty) / 2, headerMidY - 0.7, 7.5, "bold", "center");
        text("Code", (xHsn + xQty) / 2, headerMidY + 2.7, 7.5, "bold", "center");
        text("Qty.", (xQty + xUnit) / 2, headerMidY + 1.5, 7.5, "bold", "center");
        text("Unit", (xUnit + xPrice) / 2, headerMidY + 1.5, 7.5, "bold", "center");
        text("Price", (xPrice + xAmount) / 2, headerMidY + 1.5, 7.5, "bold", "center");
        text("Amount (\u20B9)", (xAmount + xEnd) / 2, headerMidY + 1.5, 7.5, "bold", "center");

        products.forEach((product, index) => {

            const y = yProdHeaderBot + 4.5 + index * rowLineH;

            const description =
                product.code
                    ? `${product.name} ${product.code}`
                    : product.name;

            text(`${index + 1}.`, xSN + 1.5, y, 7.2, "normal");
            text(description, xDesc + 1.5, y, 7.2, "normal");
            text(product.hsn, (xHsn + xQty) / 2, y, 7.2, "normal", "center");
            text(product.quantity, (xQty + xUnit) / 2, y, 7.2, "normal", "center");
            text(product.unit, (xUnit + xPrice) / 2, y, 7.2, "normal", "center");
            text(product.price.toFixed(2), xAmount - 1.5, y, 7.2, "normal", "right");
            text(product.amount.toFixed(2), xEnd - 1.5, y, 7.2, "normal", "right");

        });


        // =====================================================
        // ADD: TAX ROW
        // =====================================================

        vLine(xPrice, yProdBodyBot, yGrandBot);
        hLine(left, right, yProdBodyBot);

        let addY = yProdBodyBot + 4.5;

        text(subtotal.toFixed(2), xEnd - 1.5, addY, 7.5, "normal", "right");

        if (taxable18 > 0) {

            addY += addLineH;
            text("Add: SGST@ 9.0%", xAmount - 2, addY, 7.2, "bolditalic", "right");
            text(sgst18.toFixed(2), xEnd - 1.5, addY, 7.5, "normal", "right");

            addY += addLineH;
            text("Add: CGST@ 9.0%", xAmount - 2, addY, 7.2, "bolditalic", "right");
            text(cgst18.toFixed(2), xEnd - 1.5, addY, 7.5, "normal", "right");

        }

        if (taxable5 > 0) {

            addY += addLineH;
            text("Add: SGST@ 2.5%", xAmount - 2, addY, 7.2, "bolditalic", "right");
            text(sgst5.toFixed(2), xEnd - 1.5, addY, 7.5, "normal", "right");

            addY += addLineH;
            text("Add: CGST@ 2.5%", xAmount - 2, addY, 7.2, "bolditalic", "right");
            text(cgst5.toFixed(2), xEnd - 1.5, addY, 7.5, "normal", "right");

        }

        hLine(left, right, yAddBot);


        // =====================================================
        // GRAND TOTAL
        // =====================================================

        const totalQty =
            products.reduce((sum, product) => sum + product.quantity, 0);

        const totalUnit =
            (products[0]?.unit || "pcs").toUpperCase();

        const grandMidY =
            yAddBot + grandTotalH / 2 + 1.5;

        text(`Grand Total     ${totalQty} ${totalUnit}.`, left + 2, grandMidY, 8, "bold");
        text("`", xPrice - 2, grandMidY, 8, "bold", "right");
        text(`\u20B9 ${grandTotal.toFixed(2)}`, (xPrice + xEnd) / 2, grandMidY, 8, "bold", "center");

        hLine(left, right, yGrandBot);


        // =====================================================
        // TAX SUMMARY TABLE
        // =====================================================

        const taxCols = [32, 29.5, 29.5, 32, 37]; // sums to 160
        const taxHeaders = ["Tax Rate", "Taxable Amt", "SGST Amt", "CGST Amt", "Total Tax"];

        let tx = left;

        const taxColX = taxCols.map(w => {
            const x0 = tx;
            tx += w;
            return x0;
        });

        taxColX.push(left + taxTableW);

        hLine(left, left + taxTableW, yTaxHeaderBot);

        for (let i = 0; i <= taxCols.length; i++) {
            vLine(taxColX[i], yGrandBot, yTaxRowsBot);
        }

        const taxHeaderMidY =
            yGrandBot + taxHeaderH / 2 + 1.3;

        taxHeaders.forEach((header, i) => {
            text(header, (taxColX[i] + taxColX[i + 1]) / 2, taxHeaderMidY, 7.3, "bold", "center");
        });

        const taxRows = [];

        if (taxable5 > 0) {
            taxRows.push(["5%", taxable5, sgst5, cgst5, sgst5 + cgst5]);
        }

        if (taxable18 > 0) {
            taxRows.push(["18%", taxable18, sgst18, cgst18, sgst18 + cgst18]);
        }

        taxRows.forEach((row, rowIndex) => {

            const rowY = yTaxHeaderBot + rowIndex * taxRowH;
            const midY = rowY + taxRowH / 2 + 1.3;

            hLine(left, left + taxTableW, rowY + taxRowH);

            row.forEach((value, columnIndex) => {

                const display =
                    typeof value === "number" ? value.toFixed(2) : value;

                const align =
                    columnIndex === 0 ? "center" : "right";

                const x =
                    align === "center"
                        ? (taxColX[columnIndex] + taxColX[columnIndex + 1]) / 2
                        : taxColX[columnIndex + 1] - 2;

                text(display, x, midY, 7.2, columnIndex === 0 ? "bold" : "normal", align);

            });

        });


        // =====================================================
        // AMOUNT IN WORDS
        // =====================================================

        hLine(left, right, yWordsBot);

        text(
            `Rupees ${numberToWords(Math.round(grandTotal))} Only.`,
            left + 2,
            yTaxRowsBot + wordsH / 2 + 1.5,
            7.5,
            "bold"
        );


        // =====================================================
        // TERMS & RECEIVER SIGNATURE
        // =====================================================

        vLine(midX, yWordsBot, yForArBot);
        hLine(midX, right, yReceiverBot);

        text("Terms & Conditions", left + 2, yWordsBot + 4.5, 7.5, "bold");
        underlineLeft(left + 2, yWordsBot + 4.5, "Terms & Conditions", 7.5, "bold");

        text("E.& O.E.", left + 2, yWordsBot + 8.5, 7.2, "normal");
        text("1. Goods once sold will not be taken back.", left + 2, yWordsBot + 12.3, 7.2, "normal");
        text("2. Interest @ 12% p.a. will be charged if the payment", left + 2, yWordsBot + 16.1, 7.2, "normal");
        text("   is not made within the stipulated time.", left + 2, yWordsBot + 19.9, 7.2, "normal");
        text("3. Subject to 'Delhi' Jurisdiction only.", left + 2, yWordsBot + 23.7, 7.2, "normal");

        text("Receiver's Signature     :", midX + 2, yWordsBot + 5.5, 7.5, "bold");

        text(`for ${sellerName}`, right - 2, yReceiverBot + 9, 7.5, "bold", "right");
        text("Authorized Signatory", right - 2, yReceiverBot + 16, 7.5, "bold", "right");


        // =====================================================
        // FOOTER
        // =====================================================

        text("This is a Computer-Generated Invoice.", midX, yForArBot + 6, 7, "normal", "center");


        // =====================================================
        // SAVE
        // =====================================================

        const filename =
            `Invoice-${invoiceNumber || "New"}.pdf`;

        doc.save(filename);

    }

});