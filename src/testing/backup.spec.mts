import { SINGLE } from "@digital-alchemy/core";

import { BackupResponse } from "../helpers/index.mts";
import { hassTestRunner } from "../mock_assistant/index.mts";

describe("Backup", () => {
  afterEach(async () => {
    await hassTestRunner.teardown();
    vi.restoreAllMocks();
  });

  it("should format removes properly", async () => {
    expect.assertions(1);
    await hassTestRunner.run(({ lifecycle, hass }) => {
      lifecycle.onReady(async () => {
        const spy = vi.spyOn(hass.socket, "sendMessage");
        await hass.backup.remove("test");
        expect(spy).toHaveBeenCalledWith(
          expect.objectContaining({
            slug: "test",
            type: "backup/remove",
          }),
        );
      });
    });
  });

  it("should format list requests properly", async () => {
    expect.assertions(1);
    await hassTestRunner.run(({ lifecycle, hass }) => {
      lifecycle.onReady(async () => {
        const spy = vi.spyOn(hass.socket, "sendMessage");
        await hass.backup.list();
        expect(spy).toHaveBeenCalledWith(
          expect.objectContaining({
            type: "backup/info",
          }),
        );
      });
    });
  });

  it("should first attempt to sign with downloads", async () => {
    expect.assertions(1);
    await hassTestRunner.run(({ lifecycle, hass }) => {
      lifecycle.onReady(async () => {
        const spy = vi.spyOn(hass.socket, "sendMessage").mockImplementation(async () => undefined);
        await hass.backup.download("test", "/foo/bar");
        expect(spy).toHaveBeenCalledWith(
          expect.objectContaining({
            path: `/api/backup/download/test`,
            type: "auth/sign_path",
          }),
        );
      });
    });
  });

  it("should use the sign path to download", async () => {
    expect.assertions(1);
    await hassTestRunner.run(({ lifecycle, hass }) => {
      lifecycle.onReady(async () => {
        const path = "/test/thing";
        const destination = "/foo/bar";
        vi.spyOn(hass.socket, "sendMessage").mockImplementation(async () => ({ path }));
        const spy = vi.spyOn(hass.fetch, "download").mockImplementation(async () => undefined);
        await hass.backup.download("test", destination);
        expect(spy).toHaveBeenCalledWith(destination, expect.objectContaining({ url: path }));
      });
    });
  });

  it("should use the sign path to download", async () => {
    expect.assertions(1);
    await hassTestRunner.run(({ lifecycle, hass }) => {
      lifecycle.onReady(async () => {
        const path = "/test/thing";
        const destination = "/foo/bar";
        vi.spyOn(hass.socket, "sendMessage").mockImplementation(async () => ({ path }));
        const spy = vi.spyOn(hass.fetch, "download").mockImplementation(async () => undefined);
        await hass.backup.download("test", destination);
        expect(spy).toHaveBeenCalledWith(destination, expect.objectContaining({ url: path }));
      });
    });
  });

  it("should not start a new backup if one is already in progress", async () => {
    expect.assertions(1);
    await hassTestRunner.configure({ hass: { RETRY_INTERVAL: 0 } }).run(({ lifecycle, hass }) => {
      lifecycle.onReady(async () => {
        const spy = vi.spyOn(hass.socket, "sendMessage");
        const responses = [
          { backing_up: true, backups: [] },
          { backing_up: false, backups: [] },
        ] as BackupResponse[];

        vi.spyOn(hass.backup, "list").mockImplementation(async () => responses.shift());

        await hass.backup.generate();
        expect(spy).not.toHaveBeenCalledWith({ type: "backup/generate" });
      });
    });
  });

  it("should start a new backup if one is not already in progress", async () => {
    expect.assertions(1);
    await hassTestRunner.configure({ hass: { RETRY_INTERVAL: 0 } }).run(({ lifecycle, hass }) => {
      lifecycle.onReady(async () => {
        const spy = vi.spyOn(hass.socket, "sendMessage");
        const responses = [
          { backing_up: false, backups: [] },
          { backing_up: true, backups: [] },
          { backing_up: false, backups: [] },
        ] as BackupResponse[];

        vi.spyOn(hass.backup, "list").mockImplementation(async () => responses.shift());

        await hass.backup.generate();
        expect(spy).toHaveBeenCalledWith(expect.objectContaining({ type: "backup/generate" }));
      });
    });
  });

  it("should confirm a new backup is in progress before monitoring", async () => {
    expect.assertions(1);
    await hassTestRunner.configure({ hass: { RETRY_INTERVAL: 0 } }).run(({ lifecycle, hass }) => {
      lifecycle.onReady(async () => {
        const responses = [
          // not backing up
          { backing_up: false, backups: [] },
          // waiting...
          { backing_up: false, backups: [] },
          // waiting...
          { backing_up: false, backups: [] },
          // waiting...
          { backing_up: false, backups: [] },
          // true breaks out of loop confirm loop
          { backing_up: true, backups: [] },
          // false breaks out of actively backing up loop
          { backing_up: false, backups: [] },
          // should never be sent
          { backing_up: false, backups: [] },
        ] as BackupResponse[];
        const length = responses.length;

        const spy = vi.spyOn(hass.backup, "list").mockImplementation(async () => responses.shift());

        await hass.backup.generate();
        expect(spy).toHaveBeenCalledTimes(length - SINGLE);
      });
    });
  });
});
