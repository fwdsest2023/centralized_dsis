<?php namespace App\Controllers;

use CodeIgniter\HTTP\IncomingRequest;
use App\Models\RequestModel;
use App\Models\AuthModel;
use App\Models\HistoryModel;
use \Firebase\JWT\JWT;

// QR Code Components
use Endroid\QrCode\Color\Color;
use Endroid\QrCode\Encoding\Encoding;
use Endroid\QrCode\ErrorCorrectionLevel\ErrorCorrectionLevelLow;
use Endroid\QrCode\QrCode;
use Endroid\QrCode\Label\Label;
use Endroid\QrCode\Logo\Logo;
use Endroid\QrCode\RoundBlockSizeMode\RoundBlockSizeModeMargin;
use Endroid\QrCode\Writer\PngWriter;

class Generate extends BaseController
{
    public function __construct(){
        //Models
        $this->reqModel = new RequestModel();
        $this->authModel = new AuthModel();
        $this->historyModel = new HistoryModel();
    }

    public function downloadTest(){
        // Check Auth header bearer
        $authorization = $this->request->getServer('HTTP_AUTHORIZATION');
        if(!$authorization){
            $response = [
                'message' => 'Unauthorized Access'
            ];

            return $this->response
                    ->setStatusCode(401)
                    ->setContentType('application/json')
                    ->setBody(json_encode($response));
            exit();
        }

        $data = $this->request->getJSON();
        if(!isset($data->keyword)){
            $downloadLink = base_url("index.php/mlrs/api/v1/generate/testResult/". $data->appId);
        } else {
            $downloadLink = base_url("index.php/mlrs/api/v1/generate/testResult/old/". $data->appId ."/". $data->keyword);
        }
        

        $response = [
            "urlLink" =>  $downloadLink
        ];
        
        return $this->response
                    ->setStatusCode(200)
                    ->setContentType('application/json')
                    ->setBody(json_encode($response));

    }

    public function downloadAntigenTest(){
        // Check Auth header bearer
        $authorization = $this->request->getServer('HTTP_AUTHORIZATION');
        if(!$authorization){
            $response = [
                'message' => 'Unauthorized Access'
            ];

            return $this->response
                    ->setStatusCode(401)
                    ->setContentType('application/json')
                    ->setBody(json_encode($response));
            exit();
        }

        $data = $this->request->getJSON();

        $downloadLink = base_url("index.php/mlrs/api/v1/generate/testAntigenResult/". $data->appId);

        $response = [
            "urlLink" =>  $downloadLink
        ];
        
        return $this->response
                    ->setStatusCode(200)
                    ->setContentType('application/json')
                    ->setBody(json_encode($response));

    }

    public function getAntigenTestResult($id){
        
        //Data Gather 
        $query = $this->reqModel->getDetails(["id" => $id]);

        $query->approveBy = $this->reqModel->getUserSignature(["id" => $query->approveBy]);
        $query->encodedBy = $this->reqModel->getUserSignature(["id" => $query->encodedBy]);

        // QR Code Implementation
        $writer = new PngWriter();
        // Create QR code
        $qrLink = base_url("index.php/mlrs/api/v1/generate/testAntigenResult/". $id);
        // print_r($qrLink);
        // exit();
        $qrCode = QrCode::create($qrLink)
        ->setEncoding(new Encoding('UTF-8'))
        ->setErrorCorrectionLevel(new ErrorCorrectionLevelLow())
        ->setSize(300)
        ->setMargin(10)
        ->setRoundBlockSizeMode(new RoundBlockSizeModeMargin())
        ->setForegroundColor(new Color(0, 0, 0))
        ->setBackgroundColor(new Color(255, 255, 255));

        $result = $writer->write($qrCode);

        // header('Content-Type: '.$result->getMimeType());
        // echo $result->getString();
        // echo "<br/>";

        $qrUri = $result->getDataUri();

        $query->qrCode = $qrUri;

        ob_start();
        // Generate the PDF
        $dompdf = new \Dompdf\Dompdf(); 
        $dompdf->loadHtml(view('test_result/antigen', (array)$query));
        $dompdf->setPaper('Legal', 'portrait');
        $dompdf->render();
        $dompdf->stream($query->referenceId .'.pdf', ["Attachment" => true]);

    }

    public function getTestResult($id){
        
        //Data Gather 
        $query = $this->reqModel->getDetails(["id" => $id]);
        $query->requisitioner = $this->reqModel->getRequisitioner(["id" => $query->createdBy]);

        $performer = [];
        $approver = [];
        $process = explode(",", $query->performedBy);
        $approve = explode(",", $query->approveBy);
        // sort($approve);
        foreach($process as $key => $value) {
            $qry = $this->reqModel->getUserSignature(["id" => $value]);
            array_push($performer, $qry);
        }
        foreach($approve as $key => $value) {
            $aqry = $this->reqModel->getUserSignature(["id" => $value]);
            array_push($approver, $aqry);
        }

        $query->performedBy = $performer;
        $query->approveBy = $approver;

        $query->verifiedBy = $this->reqModel->getUserSignature(["id" => $query->verifiedBy]);
        $query->encodedBy = $this->reqModel->getUserSignature(["id" => $query->encodedBy]);
        $query->isoImageURL = $this->isoImage();

        // echo "<pre>";
        // print_r($query);
        // exit();

        // QR Code Implementation
        $writer = new PngWriter();
        // Create QR code
        // $qrLink = "http://47.91.24.159/search/scan/". $query->referenceId;
        $qrLink = base_url("index.php/mlrs/api/v1/verify/qr/testResult/". $id);
        // print_r($qrLink);
        // exit();
        $qrCode = QrCode::create($qrLink)
        ->setEncoding(new Encoding('UTF-8'))
        ->setErrorCorrectionLevel(new ErrorCorrectionLevelLow())
        ->setSize(300)
        ->setMargin(10)
        ->setRoundBlockSizeMode(new RoundBlockSizeModeMargin())
        ->setForegroundColor(new Color(0, 0, 0))
        ->setBackgroundColor(new Color(255, 255, 255));

        $result = $writer->write($qrCode);

        // header('Content-Type: '.$result->getMimeType());
        // echo $result->getString();
        // echo "<br/>";

        $qrUri = $result->getDataUri();

        $query->qrCode = $qrUri;
        ob_start();
        // Generate the PDF
        $dompdf = new \Dompdf\Dompdf(); 
        $dompdf->loadHtml(view('test_result/result', (array)$query));
        $dompdf->setPaper('Legal', 'portrait');
        $dompdf->render();
        $dompdf->stream($query->referenceId .'.pdf', ["Attachment" => true]);

        

    }

    public function getVerifyTestResultQRCode($id){
        //Data Gather 
        $query = $this->reqModel->getDetails(["id" => $id]);

        $performer = [];
        $approver = [];
        $process = explode(",", $query->performedBy);
        $approve = explode(",", $query->approveBy);
        // sort($approve);
        foreach($process as $key => $value) {
            $qry = $this->reqModel->getUserSignature(["id" => $value]);
            array_push($performer, $qry);
        }
        foreach($approve as $key => $value) {
            $aqry = $this->reqModel->getUserSignature(["id" => $value]);
            array_push($approver, $aqry);
        }

        $query->performedBy = $performer;
        $query->approveBy = $approver;

        $query->verifiedBy = $this->reqModel->getUserSignature(["id" => $query->verifiedBy]);
        $query->encodedBy = $this->reqModel->getUserSignature(["id" => $query->encodedBy]);

        // echo "<pre>";
        // print_r($query);
        // exit();

        return view('test_result/verification', (array)$query);
        // Generate the PDF
        // $dompdf = new \Dompdf\Dompdf(); 
        // $dompdf->loadHtml(view('test_result/verification', (array)$query));
        // $dompdf->setPaper('Legal', 'portrait');
        // $dompdf->render();
        // $dompdf->stream($query->referenceId .'.pdf', ["Attachment" => false]);
    }

    public function getScannedCode($id){
        
        //Data Gather 
        $query = $this->reqModel->getDetails(["id" => $id]);
        $query->requisitioner = $this->reqModel->getRequisitioner(["id" => $query->createdBy]);

        $performer = [];
        $approver = [];
        $process = explode(",", $query->performedBy);
        $approve = explode(",", $query->approveBy);
        sort($approve);
        foreach($process as $key => $value) {
            $qry = $this->reqModel->getUserSignature(["id" => $value]);
            array_push($performer, $qry);
        }
        foreach($approve as $key => $value) {
            $aqry = $this->reqModel->getUserSignature(["id" => $value]);
            array_push($approver, $aqry);
        }

        $query->performedBy = $performer;
        $query->approveBy = $approver;

        $query->verifiedBy = $this->reqModel->getUserSignature(["id" => $query->verifiedBy]);
        $query->encodedBy = $this->reqModel->getUserSignature(["id" => $query->encodedBy]);

        // echo "<pre>";
        // print_r($query);
        // exit();

        // QR Code Implementation
        $writer = new PngWriter();
        // Create QR code
        $qrLink = base_url("index.php/mlrs/api/v1/generate/scan/code/". $id);
        $qrCode = QrCode::create($qrLink)
        ->setEncoding(new Encoding('UTF-8'))
        ->setErrorCorrectionLevel(new ErrorCorrectionLevelLow())
        ->setSize(300)
        ->setMargin(10)
        ->setRoundBlockSizeMode(new RoundBlockSizeModeMargin())
        ->setForegroundColor(new Color(0, 0, 0))
        ->setBackgroundColor(new Color(255, 255, 255));

        $result = $writer->write($qrCode);

        // header('Content-Type: '.$result->getMimeType());
        // echo $result->getString();
        // echo "<br/>";

        $qrUri = $result->getDataUri();

        $query->qrCode = $qrUri;

        // Generate the PDF
        $dompdf = new \Dompdf\Dompdf(); 
        $dompdf->loadHtml(view('test_result/result', (array)$query));
        $dompdf->setPaper('Legal', 'portrait');
        $dompdf->render();
        $dompdf->stream($query->referenceId .'.pdf', ["Attachment" => false]);

        

    }

    public function downloadForm(){

        $data = $this->request->getJSON();
        $downloadLink = base_url("index.php/mlrs/api/v1/generate/caseInvestigation/". $data->appId);

        $response = [
            "urlLink" =>  $downloadLink
        ];
            
        return $this->response
                    ->setStatusCode(200)
                    ->setContentType('application/json')
                    ->setBody(json_encode($response));

    }

    public function generateCIF($id){

        $query = $this->reqModel->getDetails(["id" => $id]);
        $query->requisitioner = $this->reqModel->getRequisitioner(["id" => $query->createdBy]);

        // echo "<pre>";
        // print_r($query);
        // exit();
        ob_start();
        $dompdf = new \Dompdf\Dompdf(array('enable_font_subsetting' => true)); 
        $dompdf->loadHtml(view('test_result/cif-form', (array)$query));
        $dompdf->setPaper('Legal', 'portrait');
        $dompdf->render();
        // $dompdf->getOptions()->setIsFontSubsettingEnabled(true);
        $dompdf->stream('CIF_'. $query->referenceId .'.pdf', ["Attachment" => false]);

        

    }

    public function cifReports(){

        $list = [];
        $data = $this->request->getJSON();

        $paramas = [
            'status' => $data->status,
            'dateFrom' => $data->dateFrom,
            'dateTo' => $data->dateTo,
        ];
        
        $result = $this->reqModel->getCIFReportRange($paramas);

        foreach ($result as $key => $value) {
            $interviewInfo = json_decode($value->interviewForm);
            $patientInfo = json_decode($value->patientForm);
            $caseInfo = json_decode($value->caseForm);
            $resultInfo = json_decode($value->testResult);
            
            $referral = isset($caseInfo->testResultClassificationReferral) ? $caseInfo->testResultClassificationReferral : '';
            $classi = isset($caseInfo->testResultClassification) ? $caseInfo->testResultClassification : '';
            $realClassification = $classi .' '. $referral;

            $list['list'][$key] = [
                "referenceId" => $value->referenceId,
                "specimenId" => $resultInfo->accessionNumber,
                "lastName" => $patientInfo->lastName,
                "firstName" => $patientInfo->firstName .''. $patientInfo->suffix,
                "middleName" => $patientInfo->middleName,
                "birthDate" => date('m/d/Y', strtotime($patientInfo->birthDate)),
                "sex" => $patientInfo->sex,
                "province" => $patientInfo->addressesDetails[0]->province,
                "municipality" => $patientInfo->addressesDetails[0]->municipality,
                "barangay" => $patientInfo->addressesDetails[0]->barangay,
                "street" => $patientInfo->addressesDetails[0]->houseNo .' '. $patientInfo->addressesDetails[0]->street,
                "facility" => $interviewInfo->drUnit,
                "dateOnset" => isset($caseInfo->dateOfOnset) ? $caseInfo->dateOfOnset : '',
                "dateOfCollection" => date('m/d/Y', strtotime($resultInfo->dateCollected)),
                "dateOfReceipt" => date('m/d/Y', strtotime($resultInfo->dateReceipt)),
                "dateOfRelease" => $resultInfo->dateTimeResult,
                "specimenType" => $resultInfo->specimenType,
                "specimenNumber" => $this->ordinalNumber($value->specimenNumber),
                "results" => $resultInfo->testResult == 'SARS-CoV-viral RNA Detected' ? 'POSITIVE' : 'NEGATIVE',
                "remarks" => $resultInfo->testResult == 'SARS-CoV-viral RNA Detected' ? 'Positive for SARS-CoV-2 (Causative agent of COVID-19)' : 'Negative for SARS-CoV-2 (Causative agent of COVID-19)',
                "contact" => $patientInfo->addressesDetails[0]->cellNumber,
                "healthStatus" => isset($caseInfo->healthStatus) ? $caseInfo->healthStatus : '',
                "rof" =>  $patientInfo->isOversease,
                "typeOfTest" => 'RT-PCR',
                "classification" =>  $realClassification,
                "passport" => $patientInfo->isOverseasePassport,
                "age" => $patientInfo->age,
                "ns1" => $resultInfo->ctValue1,
                "ns2" => $resultInfo->ctValue2,
                "ns3" => isset($resultInfo->ctValue3) ? $resultInfo->ctValue3 :'',
                "finalResult" => $resultInfo->testResult,
                "testKit" => $resultInfo->testKit
            ];
        }

        if($result){
            return $this->response
                    ->setStatusCode(200)
                    ->setContentType('application/json')
                    ->setBody(json_encode($list));
        } else {
            $response = [
                'title' => 'Error',
                'message' => 'No Data Found'
            ];

            return $this->response
                    ->setStatusCode(404)
                    ->setContentType('application/json')
                    ->setBody(json_encode($response));
        }

    }

    public function cifAntigenReports(){

        $list = [];
        $data = $this->request->getJSON();

        $paramas = [
            'status' => $data->status,
            'dateFrom' => $data->dateFrom,
            'dateTo' => $data->dateTo,
        ];
        
        $result = $this->reqModel->getCIFReportRange($paramas);

        foreach ($result as $key => $value) {
            $interviewInfo = json_decode($value->interviewForm);
            $patientInfo = json_decode($value->patientForm);
            $caseInfo = json_decode($value->caseForm);
            $resultInfo = json_decode($value->testResult);
            
            $referral = isset($caseInfo->testResultClassificationReferral) ? $caseInfo->testResultClassificationReferral : '';
            $classi = isset($caseInfo->testResultClassification) ? $caseInfo->testResultClassification : '';
            $realClassification = $classi .' '. $referral;

            $list['list'][$key] = [
                "referenceId" => $value->referenceId,
                "lastName" => $patientInfo->lastName,
                "firstName" => $patientInfo->firstName .''. $patientInfo->suffix,
                "middleName" => $patientInfo->middleName,
                "birthDate" => date('m/d/Y', strtotime($patientInfo->birthDate)),
                "sex" => $patientInfo->sex,
                "province" => $patientInfo->addressesDetails[0]->province,
                "municipality" => $patientInfo->addressesDetails[0]->municipality,
                "barangay" => $patientInfo->addressesDetails[0]->barangay,
                "street" => $patientInfo->addressesDetails[0]->houseNo .' '. $patientInfo->addressesDetails[0]->street,
                "facility" => $interviewInfo->drUnit,
                "dateOnset" => isset($caseInfo->dateOfOnset) ? $caseInfo->dateOfOnset : '',
                "dateOfReceipt" => date('m/d/Y', strtotime($resultInfo->dateReceipt)),
                "specimenType" => $resultInfo->specimenType,
                "results" => $resultInfo->finalResult,
                "remarks" => $resultInfo->examRequested,
                "contact" => $patientInfo->addressesDetails[0]->cellNumber,
                "healthStatus" => isset($caseInfo->healthStatus) ? $caseInfo->healthStatus : '',
                "rof" =>  $patientInfo->isOversease,
                "typeOfTest" => 'RT-PCR',
                "classification" =>  $realClassification,
                "passport" => $patientInfo->isOverseasePassport,
                "age" => $patientInfo->age,
                "finalResult" => $resultInfo->finalResult,
                "testKit" => $resultInfo->testKit
            ];
        }

        if($result){
            return $this->response
                    ->setStatusCode(200)
                    ->setContentType('application/json')
                    ->setBody(json_encode($list));
        } else {
            $response = [
                'title' => 'Error',
                'message' => 'No Data Found'
            ];

            return $this->response
                    ->setStatusCode(404)
                    ->setContentType('application/json')
                    ->setBody(json_encode($response));
        }

    }

    public function ordinalNumber($num) {
        if (!in_array(($num % 100),array(11,12,13))){
          switch ($num % 10) {
            // Handle 1st, 2nd, 3rd
            case 1:  return $num.'st';
            case 2:  return $num.'nd';
            case 3:  return $num.'rd';
          }
        }
        return $num.'th';
    }

    
    
    public function isoImage(){
        $base64Image = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABcAAAAbCAYAAACX6BTbAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAAEnQAABJ0Ad5mH3gAAAgnSURBVEhLHZWLW41rGsb7J2bmms122DrXSlJJklMOkTBdztQWbYwM9hjG7GGX7VxUkpRDkrJ0lHRWKpXVkg46rEoHlEqTSMe1svrNs1zrWtf7re991/093/3c9/0YDetHYHwYhr7ClwEY/oh+rA9GB9CPfEE/PoZOp2dEO8mIrOPfvqHVjaLXDTE51g8jctawjst/B+X6s+HeIMNoMfo29hmtphHds+eQU4A2P4+v5c/orC7hTW0ZrY2VaDTVNLS8pqH1NVX1KprfVNLerOJdQwldVQX0qnIZeJHH0ItCRl+UMfGunXH5GA13aCgIPE3cirWkOS8n2XUZMYsWE+25liurVxHq6cmNbdtI8Pcn/pA/Yds3EemzhbAN7kR6uPFgzUpSly3lkZMzD+cvJGbDJspjYhgZ/ozReMMrknfsJHKmBTkmc8hT2PPQUkGs0wIernBH5beX96cC+XQpmI9Bl3h/7gyl+/Zwf8lCIsyNiTcxIdfUkrKfzHlmNpvEFetQX49icvQrRpOvVWTt2E6CiSXFJgoKrRQULFpI6YG9dIUGMXnvNqMRIbSf+JXW3/7J4LUg9Ak3+RR+gcqDvjxxc+GxrSVqJ3uaPdZQusWH6tBrTHzqwQjhNc9nB3HmFmSZmlO0cB5v/3WAbxlJUCI8RoVRvM2LGBtT7jlYk+u1mr6wc9KfFEiLo+Hf/mR5LKFivRvtvttJX7KKmguXRRgDAl5fQY7vTqIUFijnWFF32AcyYuFlMbqsNFT+fjxydSJNYU6a7Cc72VG+dxf61ASoKEKX8YD20ACqj/qS57WSePv5NAeFwNd+AW+s4pGvD1fmziZzsyc98bLRUIi+TkVnwh0yNq8n1dGWHGszMqWAVAc7Ujd40nUnWs5Vy1fN4NMkVGePcGulE3H2TrQEXRFp9wl4Uz2Je/Zw0dWZ8oBjjNXmQl8NI5pKGm5dI3ndCtLtFRQL+FNrSzIcHbnt5kbNtXAmW1ugp42R+lKKw08R4u7MPft5Ah4sWu8VcE0TiX7+hK5aQ8uNCHgr1fRp0L5Wo7kazGP3JeTZScOsTCiyNCV9zmxuLl1KefBldC1voP8jvGumPjqEyBULpXJHmoIvifmkodpaDco9R4jasIM+ZSp0SjUf29BWllN35nfSFzlSoDCm2mImRWYzSJI3iHF3p+xKKMMaOdv3Pymog57Y2yg93IVzRxqvXBAXd2Okq23l4c9HRfx7GEvJh44O6H2PtqKEVyePku46hwKbGahM/0KB9TRyljpRfOwIbWmpaN93yVkBb2pFp0wUVYmkBbw+5Dyj3z4IeFM7yt2HiFnnzUSS8N0s4F1d6MqLqT55nOxlzhTamfHM+M8UOZhRu3sTbVEhfCjIZPhdm3DeC5o2Ju4n88R9vYA7UBcq4BPC+VCrhoR9vtxYtZrRu0qoF/D3fUwUF9N09gyZy9yEc6le3FjruRzd1TPUXTtNRdxVBttrhMIPUNdCf2QCDxZ5EOdoJ+DnGNeKzofe1JO034fri135YBB/jfDY0Y2+6iW1IZeIW+mG0tmB3MVOdJ7wZ/DOZR4e9yXn5nkGDc3vbofKV9QFXCTWxY37DrZCy1l045ItI021pPptJ9xhLirfXyC7UKiR12yqpiU5lqhNa4hwE573b+dteCB5p/5O0H4v8uPDGPlQL4XU0S9my/Lz4858Z+IdFNLQM0yMSeVaCa5H3l5Ezrbk8eIltBuqf14OjdX0Fz4h5de9pB3woTfmKjUhgYRscSf6kC9vxJk0vGSyKJuWcwFkrHIjRapOsjOn5fJpmQfiUH2dWoJrHTEKU5JnK8jfup3O6JtMviwXxRTRKiHVkRDN50wlCYfEbBs9qLgehv55EZP52QxEhKLa8jdy7K3JtxUf2JrQFhz4fYgYUVNO8S4vEm3NKTBYe8liMnftovlmJNqSp9IDFZPqInqeJJLy36MUBZ1nID0Dbepjui4EU+vtTZmzI6Xm03lhOY0sm1l0BAV8n2hGVJWh9tssTzSjRjI6Uxp7fcF8En/ZTW+qqEeyh6ZX6CXgBkoL0KlVdMQmUPmfQHI2bOHRHDuKrUxRm/6VKqup5Ch+4m2QVD5kAK99wfMda0k0/ZEOj5V0++/nmUSw+o9AvuQ85nNRFm/zUhluVH1379eKMrJ/P03YslXcmeciSWlLgcUMXloKuM0UcmYb814ayldDtkiGPPcW8RtPQeU4h+6D++GWTJLkFInTdFSXzpB0/B/UK29LA18JTZU0RkaTuGUn8QuXkT7XjhIbM9QWP1Bq8ify7C14czGAyc9dBs4rKPLegFKenm0+i1LP1Xw6fxZi7tN5MZikrZsl1JaSfng/vUmS4SpRUv4zekIiaDl8jNad3nSu86Bpng1lZlNkKpnScOEU+kFDcFWrydy6lvtWs8i1tSLFxYmnGzfSfug4ZZt9UC5ayg0nidnliyk8uI+u6+EMxNxlMOoWg5fD+HLiN/p3/YzGZT7FFrNQWouTLwaiM3A+0VDLk51e3DKfSbYMjIQF84iX6f9ovhtpjobVlaQFC7jrNJebMgLvrnYjzmu9eGMn2aKUrDUe5Lq4kGctI9DagmjjaVQHiYkMDh1rrCN/nw8RJtO5O/NHQi1MCZ9rT+gsK8JmmBI6fSaX5f4lkykEWEzlqOUU9sp6xMGSk66O/DFXQZDkfNiMqURM+4FY+f36ahBarUx/RobE7q9lZr6AakPDRHotki9NkniGvG7SyL7YXOKARrU0VVTT3QwfZFD0vpUsl2sJP+olxKpk/1WFREKL5PkI/wdDjuFxtTvEgwAAAABJRU5ErkJggg==";

        return $base64Image;
    }

    public function getOldTestResult($id, $hashtbl){
        $keyword = base64_decode($hashtbl);
        echo "<pre>";
        // print_r($hashtbl);
        exit();
        //Data Gather 
        $query = $this->reqModel->getDetailsOld(["id" => $id], $keyword);
        $query->requisitioner = $this->reqModel->getRequisitioner(["id" => $query->createdBy]);
        print_r($query);
        exit();
        $performer = [];
        $approver = [];
        $process = explode(",", $query->performedBy);
        $approve = explode(",", $query->approveBy);
        // sort($approve);
        foreach($process as $key => $value) {
            $qry = $this->reqModel->getUserSignature(["id" => $value]);
            array_push($performer, $qry);
        }
        foreach($approve as $key => $value) {
            $aqry = $this->reqModel->getUserSignature(["id" => $value]);
            array_push($approver, $aqry);
        }

        $query->performedBy = $performer;
        $query->approveBy = $approver;

        $query->verifiedBy = $this->reqModel->getUserSignature(["id" => $query->verifiedBy]);
        $query->encodedBy = $this->reqModel->getUserSignature(["id" => $query->encodedBy]);
        $query->isoImageURL = $this->isoImage();

        // QR Code Implementation
        $writer = new PngWriter();
        // Create QR code
        $qrLink = base_url("index.php/mlrs/api/v1/verify/qr/testResult/old/". $hashtbl ."/". $id);
        $qrCode = QrCode::create($qrLink)
        ->setEncoding(new Encoding('UTF-8'))
        ->setErrorCorrectionLevel(new ErrorCorrectionLevelLow())
        ->setSize(300)
        ->setMargin(10)
        ->setRoundBlockSizeMode(new RoundBlockSizeModeMargin())
        ->setForegroundColor(new Color(0, 0, 0))
        ->setBackgroundColor(new Color(255, 255, 255));

        $result = $writer->write($qrCode);

        $qrUri = $result->getDataUri();

        $query->qrCode = $qrUri;
        ob_start();
        // Generate the PDF
        $dompdf = new \Dompdf\Dompdf(); 
        $dompdf->loadHtml(view('test_result/result', (array)$query));
        $dompdf->setPaper('Legal', 'portrait');
        $dompdf->render();
        $dompdf->stream($query->referenceId .'.pdf', ["Attachment" => true]);
    }
}