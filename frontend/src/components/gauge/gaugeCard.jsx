import React from "react";
import GaugeComponent from "react-gauge-component";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card1";
import { formatDate } from "@/utils/time-functions";

const GaugeCard = ({ sensors, sensorData }) => {
  return (
    <div className="lg:px-16">
      <Card className="h-auto bg-quaternary rounded-xl md:rounded-2xl shadow-xl mb-6">
        <CardHeader className="flex items-center justify-between p-4">
          <CardTitle className="text-2xl font-bold">Output Sensors</CardTitle>
          <CardDescription className="text-lg text-center">
            Sensor data which are sent from microController to server.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {sensors?.length === 0 ? (
            <CardDescription className="text-lg text-center font-semibold">
              No output sensors found.
            </CardDescription>
          ) : (
            <div className="w-full flex flex-wrap justify-center gap-4 overflow-auto">
              {sensorData.map((data, index) => {
                const latestData = data.length > 0 ? data[data.length - 1] : null;
                return (
                  <Card key={index} className="bg-secondary rounded-xl shadow-xl w-80 sm:w-64 lg:w-72 max-w-full mb-6">
                    <CardHeader className="flex flex-col items-center justify-center h-16">
                      <CardTitle className="text-xl font-bold text-center">
                        {sensors[index]?.name}
                      </CardTitle>
                      <CardDescription className="text-base font-medium text-center">
                        {sensors[index]?.type}
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="flex flex-col items-center">
                      <GaugeComponent value={latestData ? latestData.value : 0} unit={sensors[index]?.unit} label={sensors[index]?.name} />
                      <p className="text-center mt-2">
                        {latestData ? latestData.value : 0} {" "} {sensors[index]?.unit}
                      </p>
                      <p className="text-gray-700 text-sm text-center font-medium mt-2">
                        Last modified:
                        <span className="font-bold ml-1">
                          {latestData ? formatDate(latestData.timestamp) : "N/A"}
                        </span>
                      </p>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default GaugeCard;
