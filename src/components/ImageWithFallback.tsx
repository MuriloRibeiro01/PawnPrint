import { useMemo, useState } from "react";
import {
  Image,
  ImageProps,
  ImageSourcePropType,
  StyleSheet,
  Text,
  View,
} from "react-native";

interface ImageWithFallbackProps extends Omit<ImageProps, "source"> {
  uri?: string;
  source?: ImageSourcePropType;
  fallbackLabel?: string;
}

export function ImageWithFallback({
  uri,
  source,
  style,
  fallbackLabel = "Sem imagem",
  ...rest
}: ImageWithFallbackProps) {
  const [didError, setDidError] = useState(false);

  const resolvedSource: ImageSourcePropType | undefined = useMemo(() => {
    if (typeof uri === "string" && uri.length > 0) {
      return { uri };
    }
    return source;
  }, [source, uri]);

  const flattenedStyle = useMemo(() => StyleSheet.flatten(style) ?? {}, [style]);

  if (!resolvedSource || didError) {
    return (
      <View style={[styles.fallback, flattenedStyle]}>
        <Text style={styles.fallbackText}>{fallbackLabel}</Text>
      </View>
    );
  }

  return (
    <Image
      source={resolvedSource}
      style={style}
      onError={() => setDidError(true)}
      {...rest}
    />
  );
}

const styles = StyleSheet.create({
  fallback: {
    alignItems: "center",
    backgroundColor: "#f4f4f5",
    borderRadius: 999,
    justifyContent: "center",
    overflow: "hidden",
  },
  fallbackText: {
    color: "#9ca3af",
    fontSize: 12,
    textAlign: "center",
  },
});
