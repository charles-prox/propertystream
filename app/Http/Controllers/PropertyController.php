<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;
use Inertia\Inertia;
use App\Models\PropertyDetails;

class PropertyController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $url = 'http://172.22.122.90/api/v1/hardware';


        $url .= '?' . 'offset=' . (($request->input("current_page", 1) - 1) * $request->input("per_page", 10));
        $url .= '&' . 'limit=' . $request->input("per_page", 10);

        if ($request->filled("search_key") && !empty($request->input("search_key"))) {
            $url .= '&' . 'search=' . $request->input("search_key");
        }

        if ($request->filled("sort_by") && !empty($request->input("sort_by"))) {
            $url .= '&' . 'sort=' . $request->input("sort_by");
        }

        if ($request->filled("order_by") && !empty($request->input("order_by"))) {
            $url .= '&' . 'order=' . $request->input("order_by");
        }


        $properties = Http::withHeaders([
            'Authorization' => 'Bearer ' . env('API_TOKEN'),
            "Content-Type" => "application/json",
            'Accept' => 'application/json',
        ])->get($url);

        $properties_with_details = PropertyDetails::pluck('property_id')->toArray();
        $propertiesJson = $properties->json();
        // Check if the response is successful
        if ($properties->successful()) {
            $users = 'http://172.22.122.90/api/v1/users';
            // // Loop through each object in the array
            foreach ($propertiesJson["rows"] as &$property) {
                if (isset($property['assigned_to']) && is_array($property['assigned_to']) && isset($property['assigned_to']['id'])) {
                    if ($property['assigned_to']['type'] === 'user') {
                        $assigned_to_id = $property['assigned_to']['id'];
                        // dd($assigned_to_id);
                        $userResponse = Http::withHeaders([
                            'Authorization' => 'Bearer ' . env('API_TOKEN'),
                            "Content-Type" => "application/json",
                            'Accept' => 'application/json',
                        ])->get($users . '/' . $assigned_to_id);
                        // Check if the request was successful
                        if ($userResponse->successful()) {
                            $userJson = $userResponse->json();
                            // Add the job title to the property
                            if (array_key_exists('jobtitle', $userJson)) {
                                $property['assigned_to']['jobtitle'] = $userJson['jobtitle'];
                            }
                        } else {
                            // Handle error, if necessary
                            return response()->json(['error' => 'Error fetching user: ' . $userResponse->body()], $properties->status());
                        }
                    }

                    if ($property['assigned_to']['type'] === 'location') {
                        $assigned_to_id = $property['assigned_to']['id'];
                        $userResponse = Http::withHeaders([
                            'Authorization' => 'Bearer ' . env('API_TOKEN'),
                            "Content-Type" => "application/json",
                            'Accept' => 'application/json',
                        ])->get($users . '?location_id=' . $assigned_to_id);
                        // Check if the request was successful
                        if ($userResponse->successful()) {
                            $userJson = $userResponse->json();
                            // Add the job title to the property
                            // dd($userJson);
                            if (count($userJson['rows']) > 0) {
                                if (array_key_exists('jobtitle', $userJson['rows'][0])) {
                                    $property['assigned_to']['jobtitle'] = $userJson['rows'][0]['jobtitle'];
                                    $property['assigned_to']['user_name'] = $userJson['rows'][0]['name'];
                                }
                            } else {
                                $property['assigned_to']['jobtitle'] = "Unidentified user.";
                                $property['assigned_to']['user_name'] = "Unidentified user.";
                            }
                        } else {
                            // Handle error, if necessary
                            return response()->json(['error' => 'Error fetching user: ' . $userResponse->body()], $properties->status());
                        }
                    }
                }
            }

            return Inertia::render('Properties', [
                'properties' => $propertiesJson,
                'properties_with_details' => $properties_with_details,
                // 'url' => $url
            ]);
        }

        // Handle errors
        return response()->json(['error' => 'Unable to fetch data'], $properties->status());
    }
}
