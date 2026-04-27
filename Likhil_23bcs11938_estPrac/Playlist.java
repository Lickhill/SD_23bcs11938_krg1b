import java.util.*;

import org.w3c.dom.Node;

import estPrac.Playlist.NodeOfSongs;

public class Playlist {
    class NodeOfSongs {
        String name;
        NodeOfSongs head;
        NodeOfSongs next;
        NodeOfSongs prev;

        NodeOfSongs(String name) {
            this.name = name;
            NodeOfSongs next = null;
            NodeOfSongs prev = null;
        }
    }

    ArrayList<String> allSongsArrayList = new ArrayList<>();
    ArrayList<String> allLyrics = new ArrayList<>();
    ArrayList<String> yourLikedSongs = new ArrayList<>();
    ArrayList<ArrayList<String>> playlists = new ArrayList<>();
    LinkedList<NodeOfSongs> queue = new LinkedList<>();head=null;head.prev=null;head.next=null;

    interface Music {
        abstract void getName(String name);

        void getLyrics(String name);

        void performLike(String name);

        void createPlayList();

        void play(String name);

        void playNext();

        void playPrev();
    }

    class Song implements Music {
        void getName(String name) {
            if (allSongsArrayList.contains(name)) {
                System.out.println("Here is your song: " + name);
            } else {
                System.out.println("error 404: song not found");
            }
        }

        void getLyrics(String name) {
            if (allLyrics.contains(name)) {
                System.out.println("Lyrics...");
            } else {
                System.out.println("no lyrics");
            }
        }
    }

    class Like implements Music {
        void performLike(String name) {
            yourLikedSongs.add(name);
        }
    }

    class createPlayList implements Music {
        playlists.add(new ArrayList<String>());
    }

    class Play implements Music {
        void play(String name) {
            System.out.println("playing...");
            head.next = new NodeOfSongs(name);
            prev = head;
            next = head.next;
            head = head.next;
        }

        void playNext() {
            play(head.next.name);
        }

        void playPrev() {
            play(head.prev.name);
        }
    }

}