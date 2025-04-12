import { ActivityIndicator, StyleSheet, View, Text } from "react-native";
import * as Location from "expo-location";
import { useEffect, useState } from "react";
import { useRouter } from "expo-router";

import { MapView, Camera, UserLocation, PointAnnotation } from "@rnmapbox/maps";
import { Button } from "@/components/ui/button";

import { colors } from "@/constants/colors";
import { toast } from "sonner-native";

const MAPBOX_API_KEY = process.env.EXPO_PUBLIC_MAPBOX_API_KEY as string;

type Feature = {
  type: "Feature";
  id: number;
  geometry: {
    type: "Point";
    coordinates: [number, number];
  };
  properties: {
    type: string;
    min_height: number;
    iso_3166_2: string;
    height: number;
    underground: "true" | "false";
    extrude: "true" | "false";
    iso_3166_1: string;
    name?: string;
    tilequery: {
      distance: number;
      geometry: "polygon";
      layer: "building";
    };
  };
};

type TileResponse = {
  features: Feature[];
};

export default function Hospitals() {
  const router = useRouter();

  const [location, setLocation] = useState<
    Location.LocationObject | undefined
  >();

  const [loading, setLoading] = useState<boolean>(false);
  const [nearestLoading, setNearestLoading] = useState(false);

  const [cameraCoords, setCameraCoords] = useState<number[]>([]);

  const [nearestHospital, setNearestHospital] = useState<Feature>();

  useEffect(() => {
    fetchLocation();
  }, []);

  const fetchLocation = async () => {
    setLoading(true);
    try {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        toast.error("Permission Denied", {
          description: "Location access is required to find nearby hospitals.",
          richColors: true,
        });
        return;
      }

      let locationData = await Location.getCurrentPositionAsync({});

      setCameraCoords([
        locationData?.coords.longitude!,
        locationData?.coords.latitude!,
      ]);

      setLocation(locationData);
    } catch (error) {
      toast.error("Something Went Wrong", {
        description: "An unexpected error occurred. Please try again.",
        richColors: true,
      });
    } finally {
      setLoading(false);
    }
  };

  const handleFindNearestHospital = async () => {
    if (!location) {
      toast.error("Permission Denied", {
        description: "Location access is required to find nearby hospitals.",
        richColors: true,
      });
      return;
    }

    setNearestLoading(true);

    try {
      const res = await fetch(
        `https://api.mapbox.com/v4/mapbox.mapbox-streets-v8/tilequery/${location.coords.longitude},${location.coords.latitude}.json?radius=1000&limit=50&dedupe&geometry=point&access_token=${MAPBOX_API_KEY}`
      );

      const data = (await res.json()) as TileResponse;

      getNearestHospital(data);
    } catch (error) {
      toast.error("Something Went Wrong", {
        description: "An unexpected error occurred. Please try again.",
        richColors: true,
      });
    } finally {
      setNearestLoading(false);
    }
  };

  const getNearestHospital = (data: TileResponse) => {
    const hospitals = data.features.filter(
      (feat) => feat.properties.type === "Hospital"
    );

    if (!hospitals.length) {
      return toast.error("No Hospitals Nearby", {
        description: "We couldn't find any hospitals in your area.",
        richColors: true,
      });
    }

    const hospital =
      hospitals.length > 0
        ? hospitals.reduce((prev, curr) =>
            curr.properties.tilequery.distance <
            prev.properties.tilequery.distance
              ? curr
              : prev
          )
        : null;

    if (!hospital) return null;

    setCameraCoords(hospital.geometry.coordinates);

    setNearestHospital(hospital);

    return hospital;
  };

  if (loading) {
    return (
      <View className="flex items-center justify-center">
        <ActivityIndicator size="large" color={colors.light.destructive} />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <MapView style={styles.map}>
        <Camera
          zoomLevel={14}
          centerCoordinate={cameraCoords}
          animationMode="flyTo"
          animationDuration={1000}
        />

        {nearestHospital ? (
          <PointAnnotation
            coordinate={nearestHospital?.geometry.coordinates}
            id="Hospital"
          >
            <View></View>
          </PointAnnotation>
        ) : null}

        <UserLocation showsUserHeadingIndicator={true} />
      </MapView>

      <View className="px-4">
        <Button
          variant={"destructive"}
          className="w-full flex items-center justify-center absolute bottom-10 elevation-md self-center"
          onPress={handleFindNearestHospital}
        >
          {nearestLoading ? (
            <ActivityIndicator
              size="small"
              color={colors.light.destructiveForeground}
            />
          ) : (
            <Text className="text-destructive-foreground">
              Find Nearest Hospital (within 1 km)
            </Text>
          )}
        </Button>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  map: {
    flex: 1,
  },
});
