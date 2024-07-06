import * as S from "@effect/schema/Schema";
import { formatError } from "@effect/schema/TreeFormatter";
import { Mnemonic, NonEmptyString1000,parseMnemonic, useEvolu, useOwner } from "@evolu/react-native";
import { Effect, Either } from "effect";
import { FC, useState } from "react";
import { Button, Text, TextInput, View } from "react-native";
import { Database } from "../db/schema";
import { appStyles } from "../styles";

export const OwnerActions: FC = () => {
  const evolu = useEvolu<Database>();
  const owner = useOwner();
  const [isMnemonicShown, setIsMnemonicShown] = useState(false);
  const [isRestoreShown, setIsRestoreShown] = useState(false);
  const [mnemonic, setMnemonic] = useState("");
  const parsedMnemonic = parseMnemonic(mnemonic).pipe(Effect.either,Effect.runSync);
  const handleMnemonicInputEndEditing = () => {
    Either.match(parsedMnemonic, {
      onLeft: () => alert("Invalid mnemonic"),
      onRight: (nmnemonic) => evolu.restoreOwner(nmnemonic, { reload: false }),
    });
  };

  return (
    <View>
      <Text>
        Open this page on a different device and use your mnemonic to restore
        your data.
      </Text>
      <View style={{ flexDirection: "row", justifyContent: "space-around" }}>
        <Button
          title={`${!isMnemonicShown ? "Show" : "Hide"} Mnemonic`}
          onPress={() => setIsMnemonicShown(!isMnemonicShown)}
        />
        <Button
          title="Restore"
          onPress={() => setIsRestoreShown(!isRestoreShown)}
        />
        <Button
          title="Reset"
          onPress={() => {
            evolu.resetOwner();
          }}
        />
      </View>
      {isMnemonicShown && owner != null && (
        <TextInput multiline selectTextOnFocus>
          {owner.mnemonic}
        </TextInput>
      )}
      {isRestoreShown && (
        <TextInput
          placeholder="insert your mnemonic"
          autoComplete="off"
          autoCorrect={false}
          style={appStyles.textInput}
          value={mnemonic}
          onChangeText={setMnemonic}
          onBlur={handleMnemonicInputEndEditing}
        />
      )}
    </View>
  );
};
