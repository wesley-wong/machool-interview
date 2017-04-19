
const express = require('express');
const fedexRoutes = express.Router();
const winston = require('winston');
const util = require('util');
const fs = require('fs');

module.exports = (fedex) => {

  fedexRoutes.get('/', (req, res, next) => {
    res.render('index');
  });

  fedexRoutes.post('/', (req,res, next) => {

    /**
     * Ship
     */
    const date = new Date
    fedex.ship({
      RequestedShipment: {
        ShipTimestamp: new Date(date.getTime() + (24*60*60*1000)).toISOString(),
        DropoffType: 'REGULAR_PICKUP',
        ServiceType: 'FEDEX_GROUND',
        PackagingType: 'YOUR_PACKAGING',
        Shipper: {
          Contact: {
            PersonName: req.body.fromName,
            CompanyName: req.body.fromCompany,
            PhoneNumber: req.body.fromPhone
          },
          Address: {
            StreetLines: [
              req.body.fromLine1
            ],
            City: req.body.fromCity,
            StateOrProvinceCode: req.body.fromProvinceCode,
            PostalCode: req.body.fromPostcode,
            CountryCode: req.body.fromCountryCode
          }
        },
        Recipient: {
          Contact: {
            PersonName: req.body.toName,
            CompanyName: req.body.toCompany,
            PhoneNumber: req.body.toPhone
          },
          Address: {
            StreetLines: [
              req.body.toLine1
            ],
            City: req.body.toCity,
            StateOrProvinceCode: req.body.toProvinceCode,
            PostalCode: req.body.toPostcode,
            CountryCode: req.body.toCountryCode,
            Residential: false
          }
        },
        ShippingChargesPayment: {
          PaymentType: 'SENDER',
          Payor: {
            ResponsibleParty: {
              AccountNumber: fedex.options.account_number
            }
          }
        },
        LabelSpecification: {
          LabelFormatType: 'COMMON2D',
          ImageType: 'PDF',
          LabelStockType: 'PAPER_4X6'
        },
        PackageCount: '1',
        RequestedPackageLineItems: [{
          SequenceNumber: 1,
          GroupPackageCount: 1,
          Weight: {
            Units: 'LB',
            Value: req.body.weight
          },
          Dimensions: {
            Length: req.body.length,
            Width: req.body.width,
            Height: req.body.height,
            Units: 'IN'
          }
        }]
      }
    }, function(err, result) {
      if(err) {
        return winston.info(util.inspect(err, {depth: null}));
      }

      // winston.info(util.inspect(result, {depth: null}));
      // winston.info(result.CompletedShipmentDetail.CompletedPackageDetails[0].Label.Parts[0].Image);
      const encodedPDF = result.CompletedShipmentDetail.CompletedPackageDetails[0].Label.Parts[0].Image
      const decodedPDF = new Buffer(encodedPDF, 'base64');

      fs.writeFile('./tmp/test.pdf', decodedPDF, function(err) {
          if(err) {
              return winston.info(err);
          }

          winston.info("The file was saved!");
          const file = fs.createReadStream('./tmp/test.pdf');
          const stat = fs.statSync('./tmp/test.pdf');
          res.setHeader('Content-Length', stat.size);
          res.setHeader('Content-Type', 'application/pdf');
          res.setHeader('Content-Disposition', 'attachment; filename=quote.pdf');
          file.pipe(res);

          // return res.redirect('/');
      });
    });

  });
  return fedexRoutes;

}